import logger from "../../logger";
import { Fragment } from "../../model/fragments";
import { createSuccessResponse, createErrorResponse } from "../../response";
import { fragment } from "./post";
/**
 * Get a list of fragments for the current user
 */
export async function getFragments(req: any, res: any) {
   const expand = req.query.expand;
   // const user = Buffer.from(req.get("authorization").split(" ")[1], "base64")
   // .toString()
   // .split(":")[0];
   const user = req.user;

   if (!expand) {
      const fragments = await Fragment.byUser(user, expand);
      console.log("getFragments#if fragments: %s", fragments); // __AUTO_GENERATED_PRINT_VAR__
      res.status(201).json(createSuccessResponse({ fragments: fragments }));
   } else {
      let fragments = await Fragment.byUser(user, true);
      res.status(201).json(createSuccessResponse({ fragments: fragments }));
   }
}

/**
 * A route to get a Fragment's data by owner ID
 */
export async function fragmentsWithId(req: any, res: any) {
   const id = req.params.id;
   const ownerId = req.user;

   try {
      // let fragments = await Fragment.byOwnerId(ownerId, id);
      let fragments = await Fragment.byOwnerId(ownerId, id);
      let data = await fragments.getData();
      res.status(201).json(createSuccessResponse({ fragments: data }));
   } catch (err) {
      logger.error(err);
      res.status(500).json(createErrorResponse(500, err as string));
   }
}

/**
 * Get the metadata for a fragment
 * @param req - the request object
 * @param res - the response object
 */
export async function getFragmentMetaData(req: any, res: any) {
   const id = req.params.id;
   const owerId = Buffer.from(req.get("authorization").split(" ")[1], "base64")
      .toString()
      .split(":")[0];

   let fragmentMetaData = await Fragment.byOwnerId(owerId, id);
   res.status(201).json(createSuccessResponse({ fragment: fragmentMetaData }));
}
