import logger from "../../logger";
import { Fragment } from "../../model/fragments";
import { createSuccessResponse } from "../../response";

/**
 * handle the request to get a list of fragments for the current user
 */
export async function fragment(req: any, res: any) {
   const obj = req.body;
   const contentType = req.header("content-type");
   const user = req.user;
   let fragment = new Fragment({ type: contentType, ownerId: user });

   try {
      await fragment.setData(obj);
      await fragment.save();

      let message = `${
         (createSuccessResponse({ Fragments: fragment }), null, 2)
      }`;
      logger.info(message);
      res.status(201).json(message);
   } catch (err) {
      logger.error(err);
      res.status(500).send(err);
   }
}
