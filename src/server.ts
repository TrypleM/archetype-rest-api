import type { Server } from "node:http";
import { app } from "./app.ts";
import type { DatabaseConnection } from "./database/connection.ts";

export const startServer = async (
    port = Number(process.env.PORT ?? 3000),
    database?: DatabaseConnection,
): Promise<Server> => {
    await database?.connect();

    try {
        return await new Promise<Server>((resolve, reject) => {
            const onError = (error: Error): void => reject(error);
            const server = app.listen(port, () => {
                server.off("error", onError);
                resolve(server);
            });
            server.once("error", onError);
        });
    } catch (error) {
        await database?.disconnect();
        throw error;
    }
};

export const stopServer = async (server: Server, database?: DatabaseConnection): Promise<void> => {
    try {
        await new Promise<void>((resolve, reject) => {
            server.close((error) => (error ? reject(error) : resolve()));
        });
    } finally {
        await database?.disconnect();
    }
};
