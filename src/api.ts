import * as dotenv from "dotenv";
import logger from "./logger";
dotenv.config();
// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env["API_URL"] || "http://localhost:8080";

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user: any) {
   console.log("Requesting user fragments data...");
   try {
      const res = await fetch(`${apiUrl}/v1/fragments`, {
         // Generate headers with the proper Authorization bearer token to pass
         headers: user.authorizationHeaders(),
      });
      if (!res.ok) {
         throw new Error(`${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      logger.info("Got user fragments data", { data });
   } catch (err) {
      logger.error("Unable to call GET /v1/fragments", { err });
   }
}
