import pino from "pino";
import { db } from "../utils/db";
import { ServiceAuth } from "../auth/service.auth";

const logger = pino({ name: "token-generator" });

const authService = ServiceAuth.make();

async function generateTokens() {
  try {
    await db.init();

    const users = await db.findAll("SELECT id, tier FROM users");
    for (const user of users) {
      const token = authService.createToken({ sub: user.id, tier: user.tier });
      logger.info({ id: user.id, token });
    }
  } catch (err) {
    logger.error(err, "Error happened when seeding the db");
  } finally {
    await db.close();
  }
}

generateTokens();
