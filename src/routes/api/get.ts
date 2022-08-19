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
   let id: string = req.params.id;
   const ownerId = req.user;

   // if id ends with ., remove the dot
   // if (id.includes(".")) {
   // id = id.split(".")[0];
   // }

   try {
      const fragments = await Fragment.byUser(ownerId, true);
      // if (!fragments) {
      // throw new Error(`User with owner id ${ownerId} has no fragments`);
      // }
      let found: any;
      // find the fragment with the given id
      for (let current of fragments) {
         // @ts-ignore
         if (current.id == id) {
            found = current;
         }
      }

      // create new fragment from found fragment
      const fragment = new Fragment(found.value);
      // fragment.setData(Buffer.from("HELLO"));
      const data = await fragment.getData();
      res.status(201).json(createSuccessResponse({ data: data }));
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
   // extension to conver to
   const extension = req.params.ext;
   // id of fragment
   const id = req.params.id;
   console.log("convertFragmentToType id: %s", id); // __AUTO_GENERATED_PRINT_VAR__

   const ownerId = req.user;
   const fragment = await Fragment.byOwnerId(ownerId, id);
   const fragmentObj = new Fragment(fragment);
   if (!fragment) {
      logger.error("Fragment not found");
      res.status(500).json(createErrorResponse(500, "Fragment not found"));
   }
   const data = await fragmentObj.getData();

   // check if the current fragment can be converted to the requested type
   if (!fragmentObj.formats().includes(extension)) {
      logger.error(`Fragment cannot be converted to this type: ${extension}`);
      res.status(500).json(
         createErrorResponse(
            500,
            `Fragment cannot be converted to this type: ${extension}`
         )
      );
   }

   console.log(
      "convertFragmentToType#if#if#if (extension == ('jpeg' || 'png' || 'webp' || 'gif')): %s",
      extension == ("jpeg" || "png" || "webp" || "gif")
   ); // __AUTO_GENERATED_PRINT_VAR__

   // use markdown it to convert to html
   if (extension == "html") {
      const md = require("markdown-it")();
      const converted = md.render(data.toString());
      res.status(201).json(converted);
      return;
   }
   // dont to anything if converting to text
   else if (extension == "txt") {
      res.status(201).json(data);
   }
   // use sharp to conver to image types
   else if (
      extension == "jpeg" ||
      extension == "png" ||
      extension == "webp" ||
      extension == "gif"
   ) {
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
         res.status(201).json(createSuccessResponse({ converted }));
      } catch (err) {
         logger.error(err);
         res.status(500).json(createErrorResponse(500, err as string));
      }
      return;
   }
}

/**
 * Get the types of fragments that can be converted to
 * @param req - the request object
 * @param res - the response object
 */
export async function getSupportedConversionTypes(req: any, res: any) {
   const id = req.params.id;
   const ownerId = req.user;
   // const fragment = await Fragment.byOwnerId(ownerId, id);
   const fragments = await Fragment.byUser(ownerId, true);

   let found: any;
   for (let current of fragments) {
      // @ts-ignore
      if (current?.id == id) {
         found = current;
      }
   }
   if (!fragments) {
      logger.error("Fragment not found");
      res.status(500).json(createErrorResponse(500, "Fragment not found"));
   }
   let fragmentObj = new Fragment(found.value);
   const dataTypes = fragmentObj.formats();

   res.status(201).json(createSuccessResponse({ dataTypes }));
}
