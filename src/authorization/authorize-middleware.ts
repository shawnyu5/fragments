import passport from "passport";

import { createErrorResponse } from "../response";
import { hash } from "../hash";
import logger from "../logger";

/**
 * @param {'bearer' | 'http'} strategyName - the passport strategy to use
 * @returns {Function} the middleware function to use for authentication
 */
export function authorize(
   strategyName: string
): (req: any, res: any, next: any) => void {
   return (req: any, res: any, next: any): void => {
      /**
       * Define a custom callback to run after the user has been authenticated
       * where we can modify the way that errors are handled, and hash emails.
       * @param {Error} err - an error object
       * @param {string} email - an authenticated user's email address
       */
      function callback(err: any, email: string) {
         // Something failed, let the the error handling middleware deal with it
         if (err) {
            logger.warn({ err }, "error authenticating user");
            return next(
               createErrorResponse(500, "Unable to authenticate user")
            );
         }

         // Not authorized, return a 401
         if (!email) {
            logger.error({ email }, "user not authorized");
            return res
               .status(401)
               .json(createErrorResponse(401, "Unauthorized"));
         }
         logger.info({ email }, "user authorized");

         // Authorized. Hash the user's email, attach to the request, and continue
         req.user = hash(email);
         logger.debug({ email, hash: req.user }, "Authenticated user");
         next();
      }

      // Call the given passport strategy's authenticate() method, passing the
      // req, res, next objects.  Invoke our custom callback when done.
      passport.authenticate(strategyName, { session: false }, callback)(
         req,
         res,
         next
      );
   };
}
