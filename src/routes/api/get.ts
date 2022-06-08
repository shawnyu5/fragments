import { createSuccessResponse } from "../../response";
/**
 * Get a list of fragments for the current user
 */
export default (req: Express.Request, res: Express.Response) => {
   // @ts-ignore
   res.status(200).json(createSuccessResponse({ fragments: [] }));
};
