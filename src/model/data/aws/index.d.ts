export function writeFragment(fragment): any;

// Read a fragment's metadata from memory db. Returns a Promise
export function readFragment(ownerId, id): any;

// Write a fragment's data to memory db. Returns a Promise
export function writeFragmentData(ownerId, id, value): any;

// Read a fragment's data from memory db. Returns a Promise
export function readFragmentData(ownerId, id): any;

// Get a list of fragment ids/objects for the given user from memory db. Returns a Promise
export async function listFragments(ownerId, expand = false): any;

// Delete a fragment's metadata and data from memory db. Returns a Promise
export function deleteFragment(ownerId, id): any;
