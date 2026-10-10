import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { Server } from "node:http";
import { app } from "../src/app.ts";

let server: Server;
let baseUrl: string;

before(async () => {
    server = app.listen(0, "127.0.0.1");
    await new Promise<void>((resolve) => server.once("listening", resolve));
    const address = server.address();
    if (!address || typeof address === "string") {
        throw new Error("No se pudo obtener el puerto de pruebas");
    }
    baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
    await new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
    });
});

test("GET / conserva la respuesta original", async () => {
    const response = await fetch(baseUrl);

    assert.equal(response.status, 200);
    assert.equal(await response.text(), "Hello World!");
});

test("GET /health devuelve el estado y cabeceras de seguridad", async () => {
    const response = await fetch(`${baseUrl}/health`);

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "ok" });
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(response.headers.get("x-powered-by"), null);
});

test("el recurso de usuarios permite crear, leer, actualizar y borrar", async () => {
    const created = await fetch(`${baseUrl}/api/v1/users`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "Ada Lovelace", email: "ada@example.com" }),
    });
    assert.equal(created.status, 201);
    const createdBody = (await created.json()) as {
        data: { id: string; name: string; email: string };
    };
    const { id } = createdBody.data;
    assert.equal(created.headers.get("location"), `/api/v1/users/${id}`);

    const listed = await fetch(`${baseUrl}/api/v1/users`);
    const listedBody = (await listed.json()) as { data: Array<{ id: string }> };
    assert.ok(listedBody.data.some((user) => user.id === id));

    const fetched = await fetch(`${baseUrl}/api/v1/users/${id}`);
    assert.deepEqual(await fetched.json(), { data: createdBody.data });

    const updated = await fetch(`${baseUrl}/api/v1/users/${id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "Ada Byron", email: "ada@example.com" }),
    });
    assert.equal(updated.status, 200);
    assert.deepEqual(await updated.json(), {
        data: { id, name: "Ada Byron", email: "ada@example.com" },
    });

    const removed = await fetch(`${baseUrl}/api/v1/users/${id}`, { method: "DELETE" });
    assert.equal(removed.status, 204);
    const missing = await fetch(`${baseUrl}/api/v1/users/${id}`);
    assert.equal(missing.status, 404);
    assert.equal(
        ((await missing.json()) as { error: { code: string } }).error.code,
        "USER_NOT_FOUND",
    );
});

test("las entradas inválidas y las rutas desconocidas devuelven errores JSON", async () => {
    const invalid = await fetch(`${baseUrl}/api/v1/users`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "", email: "no-es-email" }),
    });
    assert.equal(invalid.status, 400);
    assert.equal(
        ((await invalid.json()) as { error: { code: string } }).error.code,
        "VALIDATION_ERROR",
    );

    const malformed = await fetch(`${baseUrl}/api/v1/users`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{",
    });
    assert.equal(malformed.status, 400);
    assert.equal(
        ((await malformed.json()) as { error: { code: string } }).error.code,
        "INVALID_JSON",
    );

    const missing = await fetch(`${baseUrl}/desconocida`);
    assert.equal(missing.status, 404);
    assert.equal(((await missing.json()) as { error: { code: string } }).error.code, "NOT_FOUND");
});

test("no admite correos duplicados", async () => {
    const request = {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "Grace Hopper", email: "GRACE@example.com" }),
    };
    const created = await fetch(`${baseUrl}/api/v1/users`, request);
    assert.equal(created.status, 201);
    const { data } = (await created.json()) as { data: { id: string } };

    const duplicate = await fetch(`${baseUrl}/api/v1/users`, request);
    assert.equal(duplicate.status, 409);
    assert.equal(
        ((await duplicate.json()) as { error: { code: string } }).error.code,
        "EMAIL_IN_USE",
    );

    await fetch(`${baseUrl}/api/v1/users/${data.id}`, { method: "DELETE" });
});
