import { Router } from "express";
import { getGreeting } from "../services/root.service.ts";

export const rootRouter = Router();

rootRouter.get("/", (_request, response) => {
    response.send(getGreeting());
});

rootRouter.get("/health", (_request, response) => {
    response.json({ status: "ok" });
});
