import pino from "pino";

// Use `info` as our standard log level if not specified
const options: pino.LoggerOptions = { level: process.env.LOG_LEVEL || "info" };

// If we're doing `debug` logging, make the logs easier to read
if (options.level === "debug") {
   // https://github.com/pinojs/pino-pretty
   options.transport = {
      target: "pino-pretty",
      options: {
         colorize: true,
      },
   };
}

// Create and export a Pino Logger instance:
// https://getpino.io/#/docs/api?id=logger
export default require("pino")(options);
