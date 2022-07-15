/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const path = require("path");
const envFile = path.join(__dirname, "env.jest");
require("dotenv").config({ path: envFile });

console.log(
   `Using LOG_LEVEL=${process.env.LOG_LEVEL}. Use 'debug' in env.jest for more detail`
);
process.env.PRODUCTION = "false";

module.exports = {
   preset: "ts-jest",
   testEnvironment: "node",
   verbose: true,
   testTimeout: 50000,
   // moduleNameMapper: {
   // "#node-web-compat": "./node-web-compat-node.js",
   // },
};
