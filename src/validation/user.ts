import { HttpError } from "../errors/http-error.ts";
import type { UserInput } from "../services/users.service.ts";

export const parseUserInput = (value: unknown): UserInput => {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        throw new HttpError(400, "VALIDATION_ERROR", "El cuerpo debe ser un objeto JSON");
    }

    const record = value as Record<string, unknown>;
    const name = record.name;
    const email = record.email;

    if (typeof name !== "string" || name.trim().length < 1 || name.length > 100) {
        throw new HttpError(
            400,
            "VALIDATION_ERROR",
            "name debe ser un texto de 1 a 100 caracteres",
        );
    }

    if (
        typeof email !== "string" ||
        email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
        throw new HttpError(400, "VALIDATION_ERROR", "email debe ser un correo válido");
    }

    return { name: name.trim(), email: email.trim().toLowerCase() };
};
