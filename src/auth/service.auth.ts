import config from "../utils/config";
import jwt from "jsonwebtoken";
import { JWTPayload } from "./types";

export class ServiceAuth {
  static make() {
    return new ServiceAuth();
  }

  createToken(payload: JWTPayload) {
    return jwt.sign(payload, config.JWT_SECRET);
  }
}
