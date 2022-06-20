declare namespace NodeJS {
   interface ProcessEnv {
      AWS_COGNITO_CLIENT_ID?: string;
      AWS_COGNITO_POOL_ID?: string;
      LOG_LEVEL?: "info" | "debug";
      PORT?: string;
      HTPASSWD_FILE?: string;
      API_URL?: string;
      PRODUCTION: string;
   }
}
