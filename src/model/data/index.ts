import * as dotenv from "dotenv";
import logger from "../../logger";
dotenv.config();

// import { Metadata } from "./memory";
// import IFragment from "../../types/fragment";

// interface Service {
// readFragment(ownerId: string, id: string): Promise<IFragment>;
// writeFragmentData(fragment: Metadata): Promise<any>;
// readFragmentData(ownerId: string, id: string): Promise<any>;
// listFragments(
// ownerId: string,
// expand: boolean
// ): Promise<IFragment[] | (string | undefined)[]>;
// deleteFragment(ownerId: string, id: string): Promise<[any, any]>;
// }

if (process.env.PRODUCTION == "true") {
   logger.info("Using dynamodb in production");
   module.exports = require("./aws");
} else {
   logger.info("Using in memory database in development");
   module.exports = require("./memory");
}
