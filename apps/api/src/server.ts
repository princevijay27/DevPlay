import { buildServer } from "./app.js";

const server = await buildServer();

const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? "0.0.0.0";

try {
  await server.listen({ port, host });
  server.log.info({ port, host }, "API server started");
} catch (error) {
  server.log.error(error, "Failed to start API server");
  process.exit(1);
}

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, async () => {
    await server.close();
    process.exit(0);
  });
}
