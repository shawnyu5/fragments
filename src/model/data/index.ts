import * as dotenv from "dotenv";
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

module.exports = process.env.AWS_REGION
   ? require("./aws")
   : require("./memory");
