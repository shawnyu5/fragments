import auth from "http-auth";
import passport from "passport";
// @ts-ignore
const authPassport = require("http-auth-passport");
import { enviroment } from "../../enviroments/enviroment";

// We expect HTPASSWD_FILE to be defined.
if (!enviroment.HTPASSWD_FILE) {
   throw new Error("missing expected env var: HTPASSWD_FILE");
}

export function strategy() {
   // For our Passport authentication strategy, we'll look for a
   // username/password pair in the Authorization header.
   return authPassport(
      auth.basic({
         file: enviroment.HTPASSWD_FILE,
      })
   );
}

export function authenticate() {
   return passport.authenticate("http", { session: false });
}
