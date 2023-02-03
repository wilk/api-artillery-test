import pino from "pino";
import { db } from "./utils/db";
import { app } from "./app";
import config from "./utils/config";

const logger = pino({ name: "server" });

async function main() {
  try {
    await db.init();
    app.listen(config.PORT, () =>
      logger.info(`Listening on port ${config.PORT}`)
    );
  } catch (err) {
    logger.error(err, "An error occurred while starting the server");
    await db.close();
  }
}

process.on("uncaughtException", (err) => {
  logger.error(err, "UncaughtException detected");
  db.close();
});

process.on("beforeExit", async () => {
  await db.close();
});

process.on("exit", () => {
  db.close();
});

process.on("unhandledRejection", (reason) => {
  logger.error(reason, "UnhandledRejection detected");
});

main();
