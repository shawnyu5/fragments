// We want to gracefully shutdown our server
import stoppable from "stoppable";
// Get our logger instance
import logger from "./logger";
// Get our express app instance
import app from "./app";

// Get the desired port from the process environment. Default to `8080`
const port = parseInt(process.env.PORT || "8080", 10);

// Start a server listening on this port
const server = stoppable(
   app.listen(port, () => {
      // Log a message that the server has started, and which port it's using.
      logger.info({ port }, `Server started`);
   })
);

// Export our server instance so other parts of our code can access it if necessary.
module.exports = server;
