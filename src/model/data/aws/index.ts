import IFragment from "../../../types/fragment";
import { MemoryDB } from "../memory-db";
// import s3Client from "./s3Client";
import dbClient from "./ddbDocClient";
import {
   PutObjectCommand,
   GetObjectCommand,
   GetObjectCommandInput,
   PutObjectCommandInput,
} from "@aws-sdk/client-s3";
const data: MemoryDB = new MemoryDB();

import logger from "../../../logger";
import {
   DeleteCommand,
   DeleteCommandInput,
   GetCommand,
   PutCommand,
   QueryCommand,
   QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";

// Create two in-memory databases: one for fragment metadata and the other for raw data
// const data: MemoryDB = new MemoryDB();
// const metadata: MemoryDB = new MemoryDB();

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
export async function writeFragment(fragment: Metadata): Promise<any> {
   // Configure our PUT params, with the name of the table and item (attributes and keys)
   const params = {
      TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
      Item: fragment,
   };

   // Create a PUT command to send to DynamoDB
   const command = new PutCommand(params);

   try {
      logger.info(`Writing fragment ${fragment.id} to DynamoDB`);
      return dbClient.send(command);
   } catch (err) {
      logger.warn(
         { err, params, fragment },
         "error writing fragment to DynamoDB"
      );
      throw err;
   }
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
   // Configure our GET params, with the name of the table and key (partition key + sort key)
   const params = {
      TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
      Key: { ownerId, id },
   };

   // Create a GET command to send to DynamoDB
   const command = new GetCommand(params);

   try {
      // Wait for the data to come back from AWS
      const data = await dbClient.send(command);
      // We may or may not get back any data (e.g., no item found for the given key).
      // If we get back an item (fragment), we'll return it.  Otherwise we'll return `undefined`.
      return data?.Item?.value as IFragment;
   } catch (err) {
      logger.warn({ err, params }, "error reading fragment from DynamoDB");
      throw err;
   }
}

/**
 *  Writes a fragment's data to an in memory db
 * @param fragment the fragment to write
 * @returns Promise if successful
 */
export function writeFragmentData(fragment: Metadata): Promise<any> {
   return data.put(fragment.ownerId, fragment.id, fragment.value);
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

// Get a list of fragment ids/objects for the given user from memory db.
// Returns a Promise<Array<Fragment>|Array<string>|undefined>
export async function listFragments(ownerId: string, expand = false) {
   // Configure our QUERY params, with the name of the table and the query expression
   const params: QueryCommandInput = {
      TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
      // Specify that we want to get all items where the ownerId is equal to the
      // `:ownerId` that we'll define below in the ExpressionAttributeValues.
      KeyConditionExpression: "ownerId = :ownerId",
      // Use the `ownerId` value to do the query
      ExpressionAttributeValues: {
         ":ownerId": ownerId,
      },
   };

   // Limit to only `id` if we aren't supposed to expand. Without doing this
   // we'll get back every attribute.  The projection expression defines a list
   // of attributes to return, see:
   // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ProjectionExpressions.html
   if (!expand) {
      // @ts-ignore
      params.ProjectionExpression = "id";
   }

   // Create a QUERY command to send to DynamoDB
   const command = new QueryCommand(params);

   try {
      // Wait for the data to come back from AWS
      const data = await dbClient.send(command);

      // If we haven't expanded to include all attributes, remap this array from
      // [ {"id":"6-b-3pSg9F054u-11oItP"}, {"id":"AmXx1tgo-H1iJLFL3DQcE"} ,... ] to
      // [ "6-b-3pSg9F054u-11oItP", "AmXx1tgo-H1iJLFL3DQcE", ... ]
      // @ts-ignore
      return !expand ? data?.Items.map((item) => item.id) : data?.Items;
   } catch (err) {
      logger.error(
         { err, params },
         "error getting all fragments for user from DynamoDB"
      );
      throw err;
   }
}

// Delete a fragment's metadata and data from memory db. Returns a Promise
export async function deleteFragment(ownerId: string, id: string) {
   // Configure our PUT params, with the name of the table and item (attributes and keys)
   const params: DeleteCommandInput = {
      TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
      Key: {
         ownerId: ownerId,
         id: id,
      },
   };

   // Create a PUT command to send to DynamoDB
   const command = new DeleteCommand(params);

   try {
      return dbClient.send(command);
   } catch (err) {
      logger.warn({ err, params }, "error delete fragment to DynamoDB");
      throw err;
   }
}
