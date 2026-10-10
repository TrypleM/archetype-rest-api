import assert from "node:assert/strict";
import { test } from "node:test";
import type { DatabaseConnection } from "../src/database/connection.ts";
import { startServer, stopServer } from "../src/server.ts";

test("conecta antes de escuchar y desconecta al cerrar", async () => {
    const events: string[] = [];
    const database: DatabaseConnection = {
        connect: async () => {
            events.push("connect");
        },
        disconnect: async () => {
            events.push("disconnect");
        },
    };

    const server = await startServer(0, database);
    assert.equal(server.listening, true);
    assert.deepEqual(events, ["connect"]);

    await stopServer(server, database);
    assert.deepEqual(events, ["connect", "disconnect"]);
});
