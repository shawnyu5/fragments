import express from "express";
import routes from "./routes";
import passport from "passport";
import compression from "compression";
const auth = require("./authorization");
import cors from "cors";
import { createErrorResponse } from "./response";

const app = express();
app.use(cors());
app.use(compression());

passport.use(auth.strategy());
app.use(passport.initialize());

app.use("/", routes);

// Add 404 middleware to handle any requests for resources that can't be found can't be found
app.use((req, res) => {
   res.status(404).json(createErrorResponse(404, "not found"));
});

export default app;
