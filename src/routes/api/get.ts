import logger from "../../logger";
import { Fragment } from "../../model/fragments";
import { createSuccessResponse, createErrorResponse } from "../../response";
import sharp from "sharp";
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
   const extension = req.params.ext;

   const id = req.params.id;
   const ownerId = req.user;
   const fragment = await Fragment.byOwnerId(ownerId, id);
   const data = await fragment.getData();

   if (!fragment) {
      logger.error("Fragment not found");
      res.status(500).json(createErrorResponse(500, "Fragment not found"));
   }
   // check if the current fragment can be converted to the requested type
   if (!fragment.formats.includes(extension)) {
      logger.error(`Fragment cannot be converted to this type: ${extension}`);
      res.status(500).json(
         createErrorResponse(
            500,
            `Fragment cannot be converted to this type: ${extension}`
         )
      );
   }

   console.log("convertFragmentToType extension: %s", extension); // __AUTO_GENERATED_PRINT_VAR__
   // use markdown it to convert to html
   if (extension == "html") {
      const md = require("markdown-it")();
      console.log("convertFragmentToType#if data: %s", data); // __AUTO_GENERATED_PRINT_VAR__
      const converted = md.render(data.toString());
      res.status(201).json(createSuccessResponse({ converted: converted }));
      return;
   }
   // use sharp to conver to image types
   else if (extension == ("jpeg" || "png" || "webp" || "gif")) {
      let converted: sharp.Sharp;
      try {
         switch (extension) {
            case "jpeg":
               converted = sharp(data).jpeg();
            case "png":
               converted = sharp(data).png();
            case "webp":
               converted = sharp(data).webp();
            case "gif":
               converted = sharp(data).gif();
         }

         // @ts-ignore
         res.status(201).json(createSuccessResponse({ converted: converted }));
      } catch (err) {
         logger.error(err);
         res.status(500).json(createErrorResponse(500, err as string));
      }
      return;
   }
}
