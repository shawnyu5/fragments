/**
 * A successful response looks like:
 *
 * {
 *   "status": "ok",
 *   ...
 * }
 */
export function createSuccessResponse(data?: any) {
   return {
      status: "ok",
      ...data,
   };
}

/**
 * An error response looks like:
 *
 * {
 *   "status": "error",
 *   "error": {
 *     "code": code,
 *     "message": message,
 *   }
 * }
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
