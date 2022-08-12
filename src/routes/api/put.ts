import logger from "../../logger";
import { Fragment } from "../../model/fragments";
import { createSuccessResponse, createErrorResponse } from "../../response";

/**
 * a route to updates a fragment
 * @param req - The request object
 * @param res - The response object
 */
export async function updateFragment(req: any, res: any) {
   const id = req.params.id;
   // get the content type from the request
   const contentType = req.headers["content-type"];
   const ownerId = req.user;
   try {
      const fragment = await Fragment.byOwnerId(ownerId, id);
      // if the fragment we are trying to update does not exist, create a new one
      if (!fragment) {
         logger.error(`Fragment with id ${id} not found, unable to update`);
         res.status(404).json(
            createErrorResponse(404, "Fragment not found, unable to update")
         );
         return;
      }
      // make sure the content type is the same as the one in the request. content types can not be changed after the fact
      if (contentType !== fragment.mimeType) {
         logger.error(
            `Content type ${contentType} does not match ${fragment.mimeType}`
         );
         res.status(404).json(
            createErrorResponse(
               404,
               `Content type ${contentType} does not match ${fragment.mimeType}`
            )
         );
         return;
      }
      // update the data of fragment
      fragment.setData(Buffer.from("hello world"));
      res.send(createSuccessResponse({ fragment: fragment })).status(200);
   } catch (err) {
      logger.error(err);
      res.status(500).json(createErrorResponse(500, err as string));
   }
}
