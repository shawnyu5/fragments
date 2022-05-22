import express from "express";
import routes from "./routes";
import passport from "passport";
import compression from "compression";
import { strategy } from "./authorization";
import cors from "cors";

const app = express();
app.use(cors());
app.use(compression());

passport.use(strategy());
app.use(passport.initialize());

app.use("/", routes);

export default app;
