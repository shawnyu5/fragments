import { enviroment } from "../../enviroments/enviroment";

// Prefer Amazon Cognito
if (enviroment.AWS_COGNITO_POOL_ID && enviroment.AWS_COGNITO_CLIENT_ID) {
   // module.exports.strategy = require("./cognito").strategy;
   module.exports = require("./cognito");
}
// Also allow for an .htpasswd file to be used, but not in production
else if (enviroment.HTPASSWD_FILE && process.env.NODE_ENV !== "production") {
   module.exports = require("./basic-auth");
}
// In all other cases, we need to stop now and fix our config
else {
   throw new Error("missing env vars: no authorization configuration found");
}
