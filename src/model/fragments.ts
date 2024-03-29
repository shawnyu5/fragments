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
export function hash(str: string) {
   const hashString = crypto.createHash("sha256");
   hashString.update(str);
   return hashString.digest("hex");
}
// Functions for working with fragment metadata/data using our DB
// NOTE: need to require since data uses modules.exports
// tslint:disable-next-line
const data = require("./data");

export class Fragment {
   id: string = "";
   // hashed respresentation of the user's email
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
      this.ownerId = ownerId; // NOTE: owner id should be already hashed
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
      return await data.listFragments(ownerId, expand);
   }

   /**
    * Gets a fragment's metadata for the user by the given id.
    * @param {string} ownerId owner id (hashed email)
    * @param {string} id fragment's id
    * @returns Promise<Fragment>
    */
   static async byOwnerId(ownerId: string, id: string): Promise<Fragment> {
      return (await data.readFragment(ownerId, id)) as Fragment;
   }

   /**
    * Delete the user's fragment data and metadata for the given id
    * @param {string} ownerId user's hashed email
    * @param {string} id fragment's id
    * @returns Promise
    */
   static async delete(ownerId: any, id: any) {
      try {
         logger.info(`Deleting fragment id: ${id}`);
         return data.deleteFragment(ownerId, id);
      } catch (err) {
         logger.error(`Error deleting fragment id: ${id}`);
         logger.error(err);
         throw err;
      }
   }

   /**
    * Saves the current fragment to the database
    * @returns Promise
    */
   async save() {
      this.updated = new Date().toISOString();
      await data.writeFragment({
         ownerId: this.ownerId,
         id: this.id as string,
         value: this,
      });
   }

   /**
    * Gets the fragment's data from the database
    * @returns Promise<Buffer>
    */
   async getData(): Promise<Buffer> {
      return await data.readFragmentData(this.ownerId, this.id as string);
   }

   /**
    * Set's the fragment's data in the database
    * @param dataToSave - data to save
    * @returns Promise
    */
   async setData(dataToSave: Buffer): Promise<void> {
      this.updated = new Date().toISOString();
      this.size = dataToSave.length;
      await data.writeFragmentData({
         ownerId: this.ownerId,
         id: this.id as string,
         value: dataToSave,
      });
      await this.save();
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
   formats(): Array<string> {
      let supportedType: Array<string>;
      // console.log("Fragment#formats#if this.type: %s", this.type); // __AUTO_GENERATED_PRINT_VAR__
      if (this.type.includes("text/plain")) {
         supportedType = ["txt"];
      } else if (this.type.includes("text/markdown")) {
         supportedType = ["md", "html", "txt"];
      } else if (this.type.includes("text/html")) {
         supportedType = ["html", "txt"];
      } else if (this.type.includes("application/json")) {
         supportedType = ["json", "txt"];
      } else if (
         this.type.includes("image/png") ||
         this.type.includes("image/jpeg") ||
         this.type.includes("image/webp") ||
         this.type.includes("image/gif")
      ) {
         supportedType = ["png", "jpg", "webp", "gif"];
      } else {
         supportedType = [""];
      }
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
         "text/markdown",
         "application/json",
         "image/jpeg",
         "multipart/form-data",
         "image/png",
         "image/jpeg",
         "image/webp",
         "image/gif",
      ];
      for (const type of supportedType) {
         if (type === value) {
            return true;
         }
      }
      return false;
   }
}
