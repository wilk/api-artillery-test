import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET from environment variables");
}

if (!process.env.DB_URL) {
  throw new Error("Missing DB_URL from environment variables");
}

export default {
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  DB_URL: String(process.env.DB_URL),
  DB_URL_TEST: String(process.env.DB_URL_TEST),
};
