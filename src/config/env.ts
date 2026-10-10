export interface AppConfig {
    port: number;
}

export const loadConfig = (env: NodeJS.ProcessEnv = process.env): AppConfig => {
    const port = Number(env.PORT ?? 3000);

    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error("PORT debe ser un entero entre 1 y 65535");
    }

    return { port };
};
