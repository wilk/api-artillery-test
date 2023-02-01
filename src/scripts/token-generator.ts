import pino from "pino";
import { PromisedDatabase } from "promised-sqlite3";
import jwt from "jsonwebtoken";

const logger = pino({ name: "token-generator" });

const db = new PromisedDatabase();

async function generateTokens() {
  try {
    await db.open("db.sqlite");

    const users = await db.all("SELECT id, tier FROM users");

    db.close();
  } catch (err) {
    logger.error(err, "Error happened when seeding the db");
    throw err;
  }
}

generateTokens();
