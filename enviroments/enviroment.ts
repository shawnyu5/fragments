import * as dotenv from "dotenv";
dotenv.config();
export const enviroment = {
   PORT: process.env.PORT || 8080,
   LOG_LEVEL: process.env.LOG_LEVEL || "info",
   // AWS Amazon Cognito User Pool ID (use your User Pool ID)
   AWS_COGNITO_POOL_ID: process.env.AWS_COGNITO_POOL_ID || "",
   // AWS Amazon Cognito Client App ID (use your Client App ID)
   AWS_COGNITO_CLIENT_ID: process.env.AWS_COGNITO_CLIENT_ID || "",
   API_URL: process.env.API_URL || "",
   HTPASSWD_FILE: process.env.HTPASSWD_FILE || "",
   PRODUCTION: process.env.PRODUCTION || false,
};
