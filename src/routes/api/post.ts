import { Fragment } from "../../model/fragments";
import { enviroment } from "../../../enviroments/enviroment";
import { createSuccessResponse } from "../../response";

/**
 * handle the request to get a list of fragments for the current user
 */
export async function fragment(req: any, res: any) {
   const obj = req.body;
   const contentType = req.header("content-type");
   const user = req.headers.authorization;
   let fragment = new Fragment({ type: contentType, ownerId: user });
   await fragment.setData(obj);
   await fragment.save();

   const newFragment = await Fragment.byUser(user, true);
   // @ts-ignore
   const id = newFragment[0]?.id;

   let message = `${JSON.stringify(
      createSuccessResponse({ Fragments: newFragment[0] }),
      null,
      2
   )}`;
   res.status(201).send(message);
}
