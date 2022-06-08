import { Fragment } from "../../model/fragments";
import { enviroment } from "../../../enviroments/enviroment";
import { createSuccessResponse } from "../../response";

export default async (req: any, res: any) => {
   const obj = req.body;
   const contentType = req.header("content-type");
   const user = req.headers.authorization;
   // console.log("(anon) user: %s", user); // __AUTO_GENERATED_PRINT_VAR__
   // console.log("(anon) contentType: %s", contentType); // __AUTO_GENERATED_PRINT_VAR__
   let fragment = new Fragment({ type: contentType, ownerId: user });
   // console.log("(anon) fragment: %s", fragment); // __AUTO_GENERATED_PRINT_VAR__
   await fragment.setData(obj);
   await fragment.save();

   const newFragment = await Fragment.byUser(user, true);
   console.log("(anon) newFragment: %s", newFragment); // __AUTO_GENERATED_PRINT_VAR__
   // @ts-ignore
   const id = newFragment[0]?.id;

   let message = `
HTTP/1.1 201 Created
Location: ${enviroment.API_URL}/v1/fragments/${id}
Content-Type: application/json; charset=utf-8

${JSON.stringify(
   createSuccessResponse({ Fragments: newFragment[0] }),
   null,
   2
)}`;
   res.status(201).send(message);
};
