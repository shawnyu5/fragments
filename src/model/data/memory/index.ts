import IFragment from "../../../types/fragment";
import { MemoryDB } from "../memory-db";

// Create two in-memory databases: one for fragment metadata and the other for raw data
const data: MemoryDB = new MemoryDB();
const metadata: MemoryDB = new MemoryDB();

/**
 * Write a fragment's metadata to memory db. Returns a Promise
 * @param fragment - fragment to write
 * @returns Promise if successful
 */
export function writeFragment(fragment: IFragment) {
   return metadata.put(fragment.ownerId, fragment.id, fragment.value);
}

/**
 * Read a fragment's metadata from memory db. Returns a Promise
 * @param ownerId - owner id
 * @param id - fragment id
 * @returns Promise with retrieved fragment
 */
export async function readFragment(
   ownerId: string,
   id: string
): Promise<IFragment> {
   return await metadata.get(ownerId, id);
}

/**
 * Write a fragment's data to memory db. Returns a Promise
 * @param fragment the fragment to write
 * @returns Promise if successful
 */
export function writeFragmentData(fragment: IFragment): Promise<any> {
   return data.put(fragment.ownerId, fragment.id, fragment.value);
}

/**
 * Read a fragment's data from memory db. Returns a Promise
 * @param ownerId - owner id
 * @param id - fragment id
 * @returns Promise with retrieved fragment
 */
export async function readFragmentData(ownerId: string, id: string) {
   return await data.get(ownerId, id);
}

// Get a list of fragment ids/objects for the given user from memory db. Returns a Promise
export async function listFragments(ownerId: string, expand = false) {
   const fragments = await metadata.query(ownerId);

   // If we don't get anything back, or are supposed to give expanded fragments, return
   if (expand || !fragments) {
      return fragments;
   }

   // Otherwise, map to only send back the ids
   return fragments.map((fragment) => fragment.id);
}

// Delete a fragment's metadata and data from memory db. Returns a Promise
export function deleteFragment(ownerId: string, id: string) {
   return Promise.all([
      // Delete metadata
      metadata.del(ownerId, id),
      // Delete data
      data.del(ownerId, id),
   ]);
}