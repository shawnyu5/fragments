import logger from "../../logger";
import { Fragment } from "../../model/fragments";
import { createSuccessResponse, createErrorResponse } from "../../response";
/**
 * Get a list of fragments for the current user
 */
export async function getFragments(req: any, res: any) {
   const expand = req.query.expand;
   const user = req.user;

   if (!expand) {
      const fragments = await Fragment.byUser(user, false);
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
      const fragments = await Fragment.byOwnerId(ownerId, id);
      const data = await fragments.getData();
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
   // const owerId = Buffer.from(req.get("authorization").split(" ")[1], "base64")
   // .toString()
   // .split(":")[0];
   const ownerId = req.user;

   let fragmentMetaData = await Fragment.byOwnerId(ownerId, id);
   res.status(201).json(createSuccessResponse({ fragment: fragmentMetaData }));
}

/**
 * convert a markdown fragment to html
 * @param req - the request object
 * @param res - the response object
 */
export async function convertFragmentToType(req: any, res: any) {
   const supportedExtensions = ["md"];
   const extension = req.params.ext;
   // check if the extension passed in is supported, and the fragment type is supported to convert to that extension
   if (!supportedExtensions.includes(extension)) {
      res.status(400).json(
         createErrorResponse(
            400,
            `Unsupported extension, supported extensions are: ${supportedExtensions}`
         )
      );
      return;
   }
   const md = require("markdown-it")();

   const id = req.params.id;
   const ownerId = req.user;

   const fragment = await Fragment.byOwnerId(ownerId, id);
   const data = (await fragment.getData()).toString();
   const converted = md.render(data);

   res.status(201).json(createSuccessResponse({ html: converted }));
   // res.status(201).json(createSuccessResponse({ success: true }));
}
