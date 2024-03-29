import logger from "../../logger";
import { Fragment } from "../../model/fragments";
import { createSuccessResponse, createErrorResponse } from "../../response";

export async function deleteFragment(req: any, res: any) {
   const id = req.params.id;
   const ownerId = req.user;

   try {
      let fragment = await Fragment.byOwnerId(ownerId, id);

      await Fragment.delete(ownerId, id);
      res.status(201).json(
         createSuccessResponse({ deletedFragment: fragment })
      );
   } catch (err) {
      logger.error(err);
      res.status(500).json(createErrorResponse(500, err as string));
   }
}
