import * as dotenv from "dotenv";
import logger from "../logger";
dotenv.config();

if (process.env.PRODUCTION === "false") {
   logger.info("Using basic auth for testing");
   // NOTE: needed to disable linting since basic auth uses module.exports
   module.exports = require("./basic-auth"); // tslint:disable-line
}
// Also allow for an .htpasswd file to be used, but not in production
else if (process.env.PRODUCTION === "true") {
   logger.info("Using AWS Cognito for authentication in production");
   // console.log("Using AWS Cognito for authentication in production");
   module.exports = require("./cognito"); // tslint:disable-line
}
// In all other cases, we need to stop now and fix our config
else {
   throw new Error("missing env vars: no authorization configuration found");
}
