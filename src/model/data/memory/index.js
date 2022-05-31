import MemoryDB from "./memory-db";

// Create two in-memory databases: one for fragment metadata and the other for raw data
const data = new MemoryDB();
const metadata = new MemoryDB();

// Write a fragment's metadata to memory db. Returns a Promise
export function writeFragment(fragment) {
   return metadata.put(fragment.ownerId, fragment.id, fragment);
}

// Read a fragment's metadata from memory db. Returns a Promise
export function readFragment(ownerId, id) {
   return metadata.get(ownerId, id);
}

// Write a fragment's data to memory db. Returns a Promise
export function writeFragmentData(ownerId, id, value) {
   return data.put(ownerId, id, value);
}

// Read a fragment's data from memory db. Returns a Promise
export function readFragmentData(ownerId, id) {
   return data.get(ownerId, id);
}

// Get a list of fragment ids/objects for the given user from memory db. Returns a Promise
export async function listFragments(ownerId, expand = false) {
   const fragments = await metadata.query(ownerId);

   // If we don't get anything back, or are supposed to give expanded fragments, return
   if (expand || !fragments) {
      return fragments;
   }

   // Otherwise, map to only send back the ids
   return fragments.map((fragment) => fragment.id);
}

// Delete a fragment's metadata and data from memory db. Returns a Promise
export function deleteFragment(ownerId, id) {
   return Promise.all([
      // Delete metadata
      metadata.del(ownerId, id),
      // Delete data
      data.del(ownerId, id),
   ]);
}

// const _listFragments = listFragments;
// export { _listFragments as listFragments };
// const _writeFragment = writeFragment;
// export { _writeFragment as writeFragment };
// const _readFragment = readFragment;
// export { _readFragment as readFragment };
// const _writeFragmentData = writeFragmentData;
// export { _writeFragmentData as writeFragmentData };
// const _readFragmentData = readFragmentData;
// export { _readFragmentData as readFragmentData };
// const _deleteFragment = deleteFragment;
// export { _deleteFragment as deleteFragment };
