import express from "express";
import helmet from "helmet";
import { apiRouter } from "./routes/index.ts";
import { errorHandler, notFound } from "./middleware/errors.ts";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "100kb" }));
app.use(apiRouter);
app.use(notFound);
app.use(errorHandler);
