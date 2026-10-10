import { loadConfig } from "./config/env.ts";
import { startServer, stopServer } from "./server.ts";

const main = async (): Promise<void> => {
    const { port } = loadConfig();
    const server = await startServer(port);
    let stopping = false;

    const shutdown = (): void => {
        if (stopping) return;
        stopping = true;
        void stopServer(server).catch((error: unknown) => {
            console.error("No se pudo cerrar la API:", error);
            process.exitCode = 1;
        });
    };

    process.once("SIGINT", shutdown);
    process.once("SIGTERM", shutdown);
};

main().catch((error: unknown) => {
    console.error("No se pudo iniciar la API:", error);
    process.exitCode = 1;
});
