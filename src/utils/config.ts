import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET from environment variables");
}

export default {
  JWT_SECRET: process.env.JWT_SECRET,
};
