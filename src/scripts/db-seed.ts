import pino from "pino";
import { PromisedDatabase } from "promised-sqlite3";
import { v4 as uuid } from "uuid";
import { db } from "../utils/db";

const logger = pino({ name: "seeder" });

const users = [
  {
    id: uuid(),
    tier: "premium",
  },
  {
    id: uuid(),
    tier: "gold",
  },
  {
    id: uuid(),
    tier: "silver",
  },
  {
    id: uuid(),
    tier: "bronze",
  },
];

async function seed() {
  try {
    await db.init();

    await Promise.all(
      users.map((user) =>
        db.run("INSERT INTO users VALUES (?, ?)", user.id, user.tier)
      )
    );

    const rows = await db.findAll("SELECT id, tier FROM users");
    logger.info(rows, "Elements seeded");
  } catch (err) {
    logger.error(err, "Error happened when seeding the db");
  } finally {
    await db.close();
  }
}

seed();
