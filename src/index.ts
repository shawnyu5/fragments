import * as dotenv from "dotenv";
// We want to log any crash cases so we can debug later from logs.
import logger from "./logger";
import app from "./app";

dotenv.config();
// If we're going to crash because of an uncaught exception, log it first.
// https://nodejs.org/api/process.html#event-uncaughtexception
process.on("uncaughtException", (err, origin) => {
   logger.fatal({ err, origin }, "uncaughtException");
   throw err;
});

// If we're going to crash because of an unhandled promise rejection, log it first.
// https://nodejs.org/api/process.html#event-unhandledrejection
process.on("unhandledRejection", (reason, promise) => {
   logger.fatal({ reason, promise }, "unhandledRejection");
   throw reason;
});

// Start our server
app.listen(process.env.PORT, () => {
   logger.info(`Server listening on port ${process.env.PORT}`);
});
