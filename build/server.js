"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// We want to gracefully shutdown our server
const stoppable_1 = __importDefault(require("stoppable"));
// Get our logger instance
const logger_1 = __importDefault(require("./logger"));
// Get our express app instance
const app_1 = __importDefault(require("./app"));
// Get the desired port from the process environment. Default to `8080`
const port = parseInt(process.env.PORT || "8080", 10);
// Start a server listening on this port
const server = (0, stoppable_1.default)(app_1.default.listen(port, () => {
    // Log a message that the server has started, and which port it's using.
    logger_1.default.info({ port }, `Server started`);
}));
// Export our server instance so other parts of our code can access it if necessary.
module.exports = server;
