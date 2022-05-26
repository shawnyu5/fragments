import { createSuccessResponse } from "../../response";
/**
 * Get a list of fragments for the current user
 */
export default (req: Express.Request, res: Express.Response) => {
   // TODO: this is just a placeholder to get something working...
   // @ts-ignore
   // res.status(200).json({
   // status: "ok",
   // fragments: [],
   // });
   res.status(200).json(createSuccessResponse({ fragments: [] }));
};
