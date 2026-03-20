import app from "./server.ts";

Deno.serve({ port: 8000 }, app.fetch);
