import { enviroment } from "../../enviroments/enviroment";
import logger from "../logger";

// Prefer Amazon Cognito
if (enviroment.HTPASSWD_FILE && process.env.NODE_ENV !== "production") {
   logger.debug("Using basic auth for testing");
   console.log("Using basic auth for testing");
   module.exports = require("./basic-auth");
}
// Also allow for an .htpasswd file to be used, but not in production
else if (enviroment.AWS_COGNITO_POOL_ID && enviroment.AWS_COGNITO_CLIENT_ID) {
   logger.debug("Using AWS Cognito for authentication in production");
   module.exports = require("./cognito");
}
// In all other cases, we need to stop now and fix our config
else {
   throw new Error("missing env vars: no authorization configuration found");
}
