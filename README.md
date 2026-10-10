# Arquetipo de API REST

API de ejemplo con Express 5 y TypeScript. La ruta original `GET /` sigue devolviendo `Hello World!`; el recurso REST de ejemplo está en `/api/v1/users`.

## Estructura

```text
src/
  app.ts                  Configuración de Express
  main.ts                 Punto de entrada ejecutable
  server.ts               Arranque del servidor e inyección de dependencias
  routes/                 Definición de endpoints
  services/               Lógica de negocio
  validation/             Validación de entradas
  middleware/             Errores JSON
  config/                 Configuración validada
  database/               Contrato y conexión de base de datos
tests/                    Pruebas de la API
docs/openapi.yaml         Contrato OpenAPI
```

## Uso

Requiere Node.js 22.14 o posterior. Copie `.env.example` como referencia; las variables se leen del entorno del proceso.

```bash
npm install
npm run dev
```

La API escucha en el puerto 3000. Puede cambiarse con la variable `PORT`.

```bash
PORT=8080 npm start
```

```bash
npm run typecheck
npm test
npm run test:coverage
```

## Formato

El proyecto usa Prettier con comillas dobles, punto y coma, dos espacios de sangría y líneas de hasta 100 caracteres. Al abrirlo en VS Code, instale la extensión recomendada **Prettier - Code formatter**; la configuración de `.vscode/` aplica el formato al guardar. Las mismas reglas se pueden ejecutar desde terminal:

```bash
npm run format
npm run format:check
```

## Añadir un endpoint

Defina la ruta en `src/routes/`, coloque su lógica en `src/services/`, valide su entrada en `src/validation/` y registre el router en `src/routes/index.ts`. `src/app.ts` configura Express y los middleware. Los errores tienen la forma `{ "error": { "code": "...", "message": "..." } }`.

## API de ejemplo

`GET /health` comprueba que el proceso responde. El recurso `/api/v1/users` admite `GET` y `POST`; `/api/v1/users/:id` admite `GET`, `PUT` y `DELETE`. `POST` y `PUT` requieren JSON con `name` (1 a 100 caracteres) y `email` (correo válido y único). Puede consultar el contrato completo en [OpenAPI](docs/openapi.yaml).

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada Lovelace","email":"ada@example.com"}'
```

Los usuarios de ejemplo se guardan en memoria y desaparecen al reiniciar la API. Este recurso no implementa autenticación ni almacena contraseñas.

## Añadir una base de datos

`src/database/connection.ts` define el contrato para una conexión. Cree en `src/database/` una implementación para el motor elegido y pásela tanto a `startServer` como a `stopServer` desde `src/main.ts`. `startServer` conecta antes de aceptar peticiones y `stopServer` desconecta al cerrar el servidor. El ejemplo funciona sin una base de datos externa.
