"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const pino_http_1 = require("pino-http");
// version and author from our package.json file
// @ts-ignore
const package_json_1 = require("../package.json");
const logger_1 = __importDefault(require("./logger"));
const pino = (0, pino_http_1.pinoHttp)({
    // Use our default logger instance, which is already configured
    logger: logger_1.default,
});
// Create an express app instance we can use to attach middleware and HTTP routes
const app = (0, express_1.default)();
// Use logging middleware
app.use(pino);
// Use security middleware
app.use((0, helmet_1.default)());
// Use CORS middleware so we can make requests across origins
app.use((0, cors_1.default)());
// Use gzip/deflate compression middleware
app.use((0, compression_1.default)());
// Define a simple health check route. If the server is running
// we'll respond with a 200 OK.  If not, the server isn't healthy.
app.get("/", (req, res) => {
    // Clients shouldn't cache this response (always request it fresh)
    // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#controlling_caching
    res.setHeader("Cache-Control", "no-cache");
    // Send a 200 'OK' response with info about our repo
    res.status(200).json({
        status: "ok",
        author: package_json_1.author,
        githubUrl: "https://github.com/humphd/fragments",
        version: package_json_1.version,
    });
});
// Add 404 middleware to handle any requests for resources that can't be found can't be found
app.use((req, res) => {
    res.status(404).json({
        status: "error",
        error: {
            message: "not found",
            code: 404,
        },
    });
});
// Add error-handling middleware to deal with anything else
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    // We may already have an error response we can use, but if not, use a generic
    // 500 server error and message.
    const status = err.status || 500;
    const message = err.message || "unable to process request";
    // If this is a server error, log something so we can see what's going on.
    if (status > 499) {
        logger_1.default.error({ err }, `Error processing request`);
    }
    res.status(status).json({
        status: "error",
        error: {
            message,
            code: status,
        },
    });
});
// Export our `app` so we can access it in server.js
exports.default = app;
