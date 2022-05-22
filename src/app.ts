import express from "express";
import routes from "./routes";
import passport from "passport";
import compression from "compression";
import { strategy } from "./authorization";

const app = express();
app.use(compression());

passport.use(strategy());
app.use(passport.initialize());

app.use("/", routes);

export default app;
