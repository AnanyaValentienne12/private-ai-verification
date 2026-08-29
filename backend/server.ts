import { createApp } from "./api/app";
import { loadEnv } from "./config/env";
import { log } from "./utils/logger";

function main(): void {
  const env = loadEnv();
  const app = createApp();

  const server = app.listen(env.PORT, () => {
    log("info", "server.started", {
      port: env.PORT,
      env: env.NODE_ENV,
      model: env.AI_MODEL,
    });
  });

  server.on("error", () => {
    log("error", "server.listen_failed", { port: env.PORT });
    process.exit(1);
  });
}

main();
