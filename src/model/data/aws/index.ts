import IFragment from "../../../types/fragment";
import { MemoryDB } from "../memory-db";
import s3Client from "./s3Client";
import {
   PutObjectCommand,
   GetObjectCommand,
   DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import logger from "../../../logger";

// Create two in-memory databases: one for fragment metadata and the other for raw data
const data: MemoryDB = new MemoryDB();
const metadata: MemoryDB = new MemoryDB();

interface Metadata {
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
 *  Writes a fragment's data to an S3 Object in a Bucket
 * @param fragment the fragment to write
 * @returns Promise if successful
 */
export async function writeFragmentData(fragment: Metadata): Promise<any> {
   // Create the PUT API params from our details
   const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      // Our key will be a mix of the ownerID and fragment id, written as a path
      Key: `${fragment.ownerId}/${fragment.id}`,
      Body: data,
   };

   // Create a PUT Object command to send to S3
   // @ts-ignore
   const command = new PutObjectCommand(params);

   try {
      // Use our client to send the command
      await s3Client.send(command);
   } catch (err) {
      // If anything goes wrong, log enough info that we can debug
      const { Bucket, Key } = params;
      logger.error({ err, Bucket, Key }, "Error uploading fragment data to S3");
      throw new Error("unable to upload fragment data");
   }
}

/**
* Convert a stream of data into a Buffer, by collecting
chunks of data until finished, then assembling them together
 * @param stream - stream of data
 * @returns Promise if successful
 */
function streamToBuffer(stream: any): Promise<Buffer> {
   // As the data streams in, we'll collect it into an array.
   const chunks: Array<any> = [];

   // Streams have events that we can listen for and run
   // code.  We need to know when new `data` is available,
   // if there's an `error`, and when we're at the `end`
   // of the stream.

   // When there's data, add the chunk to our chunks list
   stream.on("data", (chunk: any) => chunks.push(chunk));
   // When there's an error, reject the Promise
   stream.on("error", Promise.reject);
   // When the stream is done, resolve with a new Buffer of our chunks
   return stream.on("end", () => Promise.resolve(Buffer.concat(chunks)));
}

/**
 * Reads a fragment's data from S3
 * @param ownerId - owner id
 * @param id - fragment id
 * @returns Promise with retrieved fragment
 */
export async function readFragmentData(
   ownerId: string,
   id: string
): Promise<Buffer> {
   // Create the PUT API params from our details
   const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      // Our key will be a mix of the ownerID and fragment id, written as a path
      Key: `${ownerId}/${id}`,
   };

   // Create a GET Object command to send to S3
   const command = new GetObjectCommand(params);

   try {
      // Get the object from the Amazon S3 bucket. It is returned as a ReadableStream.
      const data = await s3Client.send(command);
      // Convert the ReadableStream to a Buffer
      return streamToBuffer(data.Body);
   } catch (err) {
      const { Bucket, Key } = params;
      logger.error(
         { err, Bucket, Key },
         "Error streaming fragment data from S3"
      );
      throw new Error("unable to read fragment data");
   }
}

// Get a list of fragment ids/objects for the given user from memory db. Returns a Promise
export async function listFragments(ownerId: string, expand = false) {
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
export async function deleteFragment(ownerId: string, id: string) {
   // Create the PUT API params from our details
   const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      // Our key will be a mix of the ownerID and fragment id, written as a path
      Key: `${ownerId}/${id}`,
      Body: data,
   };

   // Create a DELETE Object command to send to S3
   // @ts-ignore
   const command = new DeleteObjectCommand(params);

   try {
      // Use our client to send the command
      await s3Client.send(command);
   } catch (err) {
      // If anything goes wrong, log enough info that we can debug
      const { Bucket, Key } = params;
      logger.error({ err, Bucket, Key }, "Error deleting fragment from S3");
      throw new Error("unable to delete fragment");
   }
}
