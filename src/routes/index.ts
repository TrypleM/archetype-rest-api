import { Router } from "express";
import { rootRouter } from "./root.routes.ts";
import { usersRouter } from "./users.routes.ts";

export const apiRouter = Router();

apiRouter.use(rootRouter);
apiRouter.use("/api/v1/users", usersRouter);
