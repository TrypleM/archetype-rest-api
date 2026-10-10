import type { ErrorRequestHandler, RequestHandler } from "express";
import { HttpError } from "../errors/http-error.ts";

export const notFound: RequestHandler = (_request, _response, next) => {
    next(new HttpError(404, "NOT_FOUND", "Ruta no encontrada"));
};

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, next) => {
    if (response.headersSent) {
        next(error);
        return;
    }

    if (error instanceof HttpError) {
        response.status(error.status).json({ error: { code: error.code, message: error.message } });
        return;
    }

    if (error instanceof SyntaxError && "type" in error && error.type === "entity.parse.failed") {
        response.status(400).json({ error: { code: "INVALID_JSON", message: "JSON no válido" } });
        return;
    }

    console.error(error);
    response.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Error interno" } });
};
