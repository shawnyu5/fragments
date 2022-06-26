import { Fragment } from "../../model/fragments";
import { createSuccessResponse } from "../../response";
/**
 * Get a list of fragments for the current user
 */
export async function getFragments(req: any, res: any) {
   const expand = req.query.expand;
   const user = new Buffer(req.get("authorization").split(" ")[1], "base64")
      .toString()
      .split(":")[0];

   if (!expand) {
      let fragments = await Fragment.byUser(user, false);
      res.status(201).json(createSuccessResponse({ fragments: fragments }));
   } else {
      let fragments = await Fragment.byUser(user, true);
      res.status(201).json(createSuccessResponse({ fragments: fragments }));
   }
}

/**
 * A route to get a list of fragments for the current user id
 */
export async function fragmentsWithId(req: any, res: any) {
   const id = req.params.id;
   const owerId = new Buffer(req.get("authorization").split(" ")[1], "base64")
      .toString()
      .split(":")[0];

   let fragments = await Fragment.byId(owerId, id);

   res.status(201).json(createSuccessResponse({ fragments: fragments }));
}
