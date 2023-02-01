import pino from "pino";
import { PromisedDatabase } from "promised-sqlite3";
import { v4 as uuid } from "uuid";

const logger = pino({ name: "seeder" });

const db = new PromisedDatabase();

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
    await db.open("db.sqlite");

    await db.run("CREATE TABLE users (id UUID, tier VARCHAR(25))");
    await Promise.all(
      users.map((user) =>
        db.run("INSERT INTO users VALUES (?, ?)", user.id, user.tier)
      )
    );

    const rows = await db.all("SELECT id, tier FROM users");
    logger.info(rows, "Elements seeded");
  } catch (err) {
    logger.error(err, "Error happened when seeding the db");
    throw err;
  } finally {
    db.close();
  }
}

seed();
