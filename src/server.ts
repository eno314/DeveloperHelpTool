import { Hono } from "hono";
import { serveStatic } from "hono/deno";

const app = new Hono();

// Serve static files from the "public_hono" directory
app.use("/*", serveStatic({ root: "./public_hono" }));

export default app;
