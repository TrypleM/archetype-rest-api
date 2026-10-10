import assert from "node:assert/strict";
import { test } from "node:test";
import { loadConfig } from "../src/config/env.ts";

test("PORT usa 3000 por defecto y valida el rango", () => {
    assert.deepEqual(loadConfig({}), { port: 3000 });
    assert.deepEqual(loadConfig({ PORT: "8080" }), { port: 8080 });
    assert.throws(() => loadConfig({ PORT: "invalid" }), /PORT/);
    assert.throws(() => loadConfig({ PORT: "65536" }), /PORT/);
});
