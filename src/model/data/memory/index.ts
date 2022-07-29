import IFragment from "../../../types/fragment";
import { MemoryDB } from "../memory-db";

// Create two in-memory databases: one for fragment metadata and the other for raw data
const data: MemoryDB = new MemoryDB();
const metadata: MemoryDB = new MemoryDB();

export interface Metadata {
   ownerId: string;
   id: string;
   value: any;
}

/**
 * Write a fragment's metadata to memory db. Returns a Promise
 * @param fragment - fragment to write
 * @returns Promise if successful
 */
export async function writeFragment(fragment: Metadata): Promise<void> {
   return await metadata.put(fragment.ownerId, fragment.id, fragment.value);
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
export function writeFragmentData(fragment: Metadata): Promise<any> {
   return data.put(fragment.ownerId, fragment.id, fragment.value);
}

/**
 * Read a fragment's data from memory db. Returns a Promise
 * @param ownerId - owner id
 * @param id - fragment id
 * @returns Promise with retrieved fragment
 */
export async function readFragmentData(
   ownerId: string,
   id: string
): Promise<any> {
   return await data.get(ownerId, id);
}

// Get a list of fragment ids/objects for the given user from memory db. Returns a Promise
export async function listFragments(
   ownerId: string,
   expand = false
): Promise<IFragment[] | (string | undefined)[]> {
   const fragments = await metadata.query(ownerId);

   // If we don't get anything back, or are supposed to give expanded fragments, return
   if (expand || !fragments) {
      return fragments;
   }

   // Otherwise, map to only send back the ids
   let ids = fragments.map((fragment: IFragment) => {
      return fragment?.id;
   });
   return ids;
}

// Delete a fragment's metadata and data from memory db. Returns a Promise
export function deleteFragment(
   ownerId: string,
   id: string
): Promise<[any, any]> {
   return Promise.all([
      // Delete metadata
      metadata.del(ownerId, id),
      // Delete data
      data.del(ownerId, id),
   ]);
}
