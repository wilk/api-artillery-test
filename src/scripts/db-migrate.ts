import pino from "pino";
import { db } from "../utils/db";

const logger = pino({ name: "migrate" });

async function migrate() {
  try {
    logger.info("Generating the schema...");
    await db.init();
    await db.run(
      "CREATE TABLE IF NOT EXISTS users (id UUID NOT NULL, tier VARCHAR(25) NOT NULL, CONSTRAINT pk_users_id PRIMARY KEY (id))"
    );
    logger.info("Schema generated succesfully!");
  } catch (err) {
    logger.error(err, "Error happened when generating the schema of the db");
    throw err;
  } finally {
    await db.close();
  }
}

migrate();
