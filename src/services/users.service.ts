import { randomUUID } from "node:crypto";
import { HttpError } from "../errors/http-error.ts";

export interface UserInput {
    name: string;
    email: string;
}

export interface User extends UserInput {
    id: string;
}

const users = new Map<string, User>();

export const listUsers = (): User[] => Array.from(users.values());

export const getUser = (id: string): User => {
    const user = users.get(id);
    if (!user) throw new HttpError(404, "USER_NOT_FOUND", "Usuario no encontrado");
    return user;
};

export const createUser = (input: UserInput): User => {
    if (listUsers().some((user) => user.email === input.email)) {
        throw new HttpError(409, "EMAIL_IN_USE", "El correo ya está registrado");
    }

    const user = { id: randomUUID(), ...input };
    users.set(user.id, user);
    return user;
};

export const updateUser = (id: string, input: UserInput): User => {
    getUser(id);
    if (listUsers().some((user) => user.id !== id && user.email === input.email)) {
        throw new HttpError(409, "EMAIL_IN_USE", "El correo ya está registrado");
    }

    const user = { id, ...input };
    users.set(id, user);
    return user;
};

export const deleteUser = (id: string): void => {
    getUser(id);
    users.delete(id);
};
