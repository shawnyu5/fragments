// Use https://www.npmjs.com/package/nanoid to create unique IDs
import { nanoid } from "nanoid";
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
import contentType from "content-type";
import IFragment from "../types/fragment";
import logger from "../logger";
import crypto from "crypto";

/**
 * hashes a string using SHA256
 * @param str - a string to be hashed
 * @returns the string hased with the SHA-256 algorithm
 */
function hash(str: string) {
   const hashString = crypto.createHash("sha256");
   hashString.update(str);
   return hashString.digest("hex");
}
// Functions for working with fragment metadata/data using our DB
import {
   readFragment,
   writeFragment,
   readFragmentData,
   writeFragmentData,
   listFragments,
   deleteFragment,
} from "./data";

export class Fragment {
   id: string = "";
   ownerId: string = "";
   created: string = "";
   updated: string = "";
   type: string = "";
   size: number = 0;

   constructor({
      id,
      ownerId,
      created = new Date().toISOString(),
      updated = new Date().toISOString(),
      type,
      size = 0,
   }: {
      id?: string;
      ownerId: string;
      created?: string;
      updated?: string;
      type: string;
      size?: number;
   }) {
      if (size < 0) {
         throw new Error("Fragment size must be >= 0");
      }
      this.id = id || nanoid(); // either passed in or generated
      this.ownerId = hash(ownerId);
      this.created = created;
      this.updated = updated;
      this.type = type;
      if (!Fragment.isSupportedType(this.mimeType)) {
         throw new Error(`Unsupported type: ${this.mimeType}`);
      }
      this.size = size;
   }

   /**
    * Get all fragments (id or full) for the given user
    * @param ownerId user's hashed email
    * @param expand whether to expand ids to full fragments
    * @returns all fragment for user passed in
    */
   static async byUser(
      ownerId: string,
      expand = false
   ): Promise<Array<IFragment | string | undefined>> {
      const f = await listFragments(hash(ownerId), expand);
      return f;
   }

   /**
    * Gets a fragment object for the user by the given id.
    * @param {string} ownerId user's email in plain text
    * @param {string} id fragment's id
    * @returns Promise<Fragment>
    */
   static async byId(ownerId: string, id: string): Promise<Fragment> {
      return (await readFragment(hash(ownerId), id)) as Fragment;
   }

   /**
    * Delete the user's fragment data and metadata for the given id
    * @param {string} ownerId user's hashed email
    * @param {string} id fragment's id
    * @returns Promise
    */
   static async delete(ownerId: any, id: any) {
      logger.info(`Deleting fragment id: ${id}`);
      return deleteFragment(hash(ownerId), id);
   }

   /**
    * Saves the current fragment to the database
    * @returns Promise
    */
   async save() {
      this.updated = new Date().toISOString();
      await writeFragment({
         ownerId: this.ownerId,
         id: this.id as string,
         value: this,
      });
   }

   /**
    * Gets the fragment's data from the database
    * @returns Promise<Buffer>
    */
   getData(): Promise<any> {
      return readFragmentData(this.ownerId, this.id as string);
   }

   /**
    * Set's the fragment's data in the database
    * @param {Buffer} data
    * @returns Promise
    */
   async setData(data: Buffer): Promise<void> {
      this.updated = new Date().toISOString();
      this.size = data.length;
      await writeFragmentData({
         ownerId: this.ownerId,
         id: this.id as string,
         value: data,
      });
   }

   /**
    * Returns the mime type (e.g., without encoding) for the fragment's type:
    * "text/html; charset=utf-8" -> "text/html"
    * @returns {string} fragment's mime type (without encoding)
    */
   get mimeType(): string {
      const { type } = contentType.parse(this.type);
      return type;
   }

   /**
    * Returns true if this fragment is a text/* mime type
    * @returns {boolean} true if fragment's type is text
    */
   get isText(): boolean {
      return this.mimeType.startsWith("text/");
   }

   /**
    * Returns the formats into which this fragment type can be converted
    * @returns {Array<string>} list of supported mime types
    */
   get formats(): Array<string> {
      const supportedType: Array<string> = ["text/plain"];
      return supportedType;
   }

   /**
    * Check if we know how to work with this content type
    * @param value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
    * @returns true if we support this Content-Type (i.e., type/subtype)
    */
   static isSupportedType(value: string): boolean | void {
      const supportedType: Array<string> = [
         "text/plain",
         "text/plain; charset=utf-8",
         "application/json",
      ];
      for (const type of supportedType) {
         if (type === value) {
            return true;
         }
      }
      return false;
   }
}
