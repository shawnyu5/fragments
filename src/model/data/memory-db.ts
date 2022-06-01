/**
 * @param key - The key to use for the data.
 * @returns if key is a string
 */
// function validateKey(key: any): boolean {
// return typeof key === "string";
// }

import IFragment from "../../types/fragment";

export class MemoryDB {
   db: any;
   constructor() {
      this.db = {};
   }

   /**
    * Gets a value for the given primaryKey and secondaryKey
    * @param {string} primaryKey
    * @param {string} secondaryKey
    * @returns A promise with retrieved value
    */
   get(primaryKey: string, secondaryKey: string): Promise<any> {
      const db = this.db;
      const value: any = db[primaryKey] && db[primaryKey][secondaryKey];
      return Promise.resolve(value);
   }

   /**
    * Puts a value into the given primaryKey and secondaryKey
    * @param primaryKey - The primary key to use for the data.
    * @param secondaryKey - The secondary key to use for the data.
    * @param data - The data to store.
    * @returns Promise if successful
    */
   put(primaryKey: string, secondaryKey: string, data: any): Promise<any> {
      const db = this.db;
      // Make sure the `primaryKey` exists, or create
      db[primaryKey] = db[primaryKey] || {};
      // Add the `value` to the `secondaryKey`
      db[primaryKey][secondaryKey] = data;
      return Promise.resolve();
   }

   /**
    * Queries the list of values (i.e., secondaryKeys) for the given primaryKey.
    * Always returns an Array, even if no items are found.
    * @param {string} primaryKey
    * @returns Promise<any[]>
    */
   query(primaryKey: string): Promise<any[]> {
      // if (!validateKey(primaryKey)) {
      // throw new Error(
      // `primaryKey string is required, got primaryKey=${primaryKey}`
      // );
      // }

      // No matter what, we always return an array (even if empty)
      const db = this.db;
      const values = db[primaryKey] && Object.values(db[primaryKey]);
      return Promise.resolve([].concat(values));
   }

   /**
    * Deletes the value with the given primaryKey and secondaryKey
    * @param {string} primaryKey
    * @param {string} secondaryKey
    * @returns Promise<any[]>
    */
   async del(primaryKey: string, secondaryKey: string): Promise<any> {
      // if (!(validateKey(primaryKey) && validateKey(secondaryKey))) {
      // throw new Error(
      // `primaryKey and secondaryKey strings are required, got primaryKey=${primaryKey}, secondaryKey=${secondaryKey}`
      // );
      // }

      // Throw if trying to delete a key that doesn't exist
      if (!(await this.get(primaryKey, secondaryKey))) {
         throw new Error(
            `missing entry for primaryKey=${primaryKey} and secondaryKey=${secondaryKey}`
         );
      }

      const db = this.db;
      delete db[primaryKey][secondaryKey];
      return Promise.resolve();
   }
}
