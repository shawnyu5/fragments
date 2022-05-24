import express from "express";
import api from "./api";

// version and author from package.json
// @ts-ignore
import { version, author } from "../../package.json";
const auth = require("../authorization");

// Create a router that we can use to mount our API
const router = express.Router();

/**
 * Expose all of our API routes on /v1/* to include an API version.
 */
router.use(`/v1`, auth.authenticate(), api);

/**
 * Define a simple health check route. If the server is running
 * we'll respond with a 200 OK.  If not, the server isn't healthy.
 */
router.get("/", (_, res) => {
   // Client's shouldn't cache this response (always request it fresh)
   res.setHeader("Cache-Control", "no-cache");
   // Send a 200 'OK' response
   res.status(200).json({
      status: "ok",
      author,
      // Use your own GitHub URL for this...
      githubUrl: "https://github.com/shawnyu5/fragments",
      version,
   });
});

export default router;
