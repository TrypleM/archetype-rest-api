import { Router } from "express";
import {
    createUser,
    deleteUser,
    getUser,
    listUsers,
    updateUser,
} from "../services/users.service.ts";
import { parseUserInput } from "../validation/user.ts";

export const usersRouter = Router();

usersRouter.get("/", (_request, response) => {
    response.json({ data: listUsers() });
});

usersRouter.get("/:id", (request, response) => {
    response.json({ data: getUser(request.params.id) });
});

usersRouter.post("/", (request, response) => {
    const user = createUser(parseUserInput(request.body));
    response.location(`/api/v1/users/${user.id}`).status(201).json({ data: user });
});

usersRouter.put("/:id", (request, response) => {
    response.json({ data: updateUser(request.params.id, parseUserInput(request.body)) });
});

usersRouter.delete("/:id", (request, response) => {
    deleteUser(request.params.id);
    response.status(204).end();
});
