/** Contrato para conectar el motor de base de datos elegido por la aplicación. */
export interface DatabaseConnection {
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
}
