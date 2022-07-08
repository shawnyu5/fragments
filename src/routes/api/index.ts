/**
 * The main entry-point for the v1 version of the fragments API.
 */
import express from "express";
import { Fragment } from "../../model/fragments";
import contentType from "content-type";
import * as get from "./get";
import * as post from "./post";

// Support sending various Content-Types on the body up to 5M in size
function rawBody() {
   return express.raw({
      inflate: true,
      limit: "5mb",
      type: (req) => {
         // See if we can parse this content type. If we can, `req.body` will be
         // a Buffer (e.g., `Buffer.isBuffer(req.body) === true`). If not, `req.body`
         // will be equal to an empty Object `{}` and `Buffer.isBuffer(req.body) === false`
         const { type } = contentType.parse(req);
         return Fragment.isSupportedType(type);
      },
   });
}

// Create a router on which to mount our API endpoints
const router = express.Router();

// Define our first route, which will be: GET /v1/fragments
router.get("/fragments", get.getFragments);
router.post("/fragments", rawBody(), post.fragment);
router.get("/fragments/:id", get.fragmentsWithId);
router.get("/fragments/:id/info", get.getFragmentMetaData);

export default router;
