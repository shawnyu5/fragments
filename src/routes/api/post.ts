import logger from "../../logger";
import { Fragment } from "../../model/fragments";
import { createSuccessResponse } from "../../response";

/**
 * handle the request to save a fragments for the current user
 */
export async function fragment(req: any, res: any) {
   const body = req.body;
   const contentType = req.header("content-type");
   const user = req.user;
   try {
      let fragment = new Fragment({ type: contentType, ownerId: user });

      // "multipart/form-data"
      await fragment.setData(body);
      await fragment.save();

      let message = createSuccessResponse({ Fragments: fragment });
      logger.info(message);
      res.location(
         `http://localhost:${process.env.PORT}/v1/fragments/${fragment.id}`
      );
      res.status(201).json(message);
   } catch (err) {
      logger.error(err);
      res.status(500).send(err);
   }
}
