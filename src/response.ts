/**
 * creates a successful response object
 * @param data - The data to be sent as the response.
 * @returns A response object with status: ok and data.
 */
export function createSuccessResponse(data?: any) {
   return {
      status: "ok",
      ...data,
   };
}

/**
 * creates a failed response object
 * @param code - The error code to be sent as the response.
 * @param message - The error message to be sent as the response.
 * @returns A response object with status: error and error code and message.
 */
export function createErrorResponse(code: number, message: string) {
   return {
      status: "error",
      error: {
         code: code,
         message: message,
      },
   };
}
