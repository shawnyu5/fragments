declare namespace NodeJS {
   interface ProcessEnv {
      AWS_COGNITO_CLIENT_ID?: string;
      AWS_COGNITO_POOL_ID?: string;
      LOG_LEVEL?: "info" | "debug";
      PORT?: string;
      HTPASSWD_FILE?: string;
      API_URL?: string;
      PRODUCTION: string;
      // aws region of the bucket
      AWS_REGION?: string;
      AWS_S3_ENDPOINT_URL?: string;
      AWS_S3_BUCKET_NAME?: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_SESSION_TOKEN: string;
      AWS_DYNAMODB_ENDPOINT_URL: string;
      AWS_DYNAMODB_TABLE_NAME: string;
   }
}
