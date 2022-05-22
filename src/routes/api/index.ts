/**
 * The main entry-point for the v1 version of the fragments API.
 */
import express from "express";
import get from "./get";

// Create a router on which to mount our API endpoints
const router = express.Router();

// Define our first route, which will be: GET /v1/fragments
router.get("/fragment", get);

// Other routes will go here later on...

export default router;
