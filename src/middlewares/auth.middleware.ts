import jwt from "jsonwebtoken";
import { JWTPayload } from "../auth/types";
import pino from "pino";
import { db } from "../utils/db";

const logger = pino({ name: "auth-middleware" });

export const authMiddleware = (jwtSecret: string) => {
  return async (req: any, _res: any, next: Function) => {
    if (!req.headers.authorization) {
      return next(new Error("Missing auth token"));
    }

    let payload: JWTPayload;
    try {
      const token = req.headers.authorization;
      payload = jwt.verify(token, jwtSecret) as JWTPayload;
    } catch (err) {
      logger.error(err, "Problem when decoding the JWT");
      return next(err);
    }

    const user = await db.findOne(
      "SELECT id, tier FROM users WHERE id = ?",
      payload.sub
    );
    if (!user) {
      return next(new Error("Current user not found on the db"));
    }

    req.user = user;

    next();
  };
};
