import config from "../utils/config";
import { v4 as uuid } from "uuid";
import { db } from "../utils/db";
import { User } from "../auth/types";
import { authMiddleware } from "./auth.middleware";
import { ServiceAuth } from "../auth/service.auth";

describe("Auth Middleware", () => {
  const serviceAuth = ServiceAuth.make();
  const signedUpUser: User = {
    id: uuid(),
    tier: "platinum",
  };
  const signedUpRequest = {
    headers: {
      authorization: `Bearer ${serviceAuth.createToken({
        sub: signedUpUser.id,
        tier: signedUpUser.tier,
      })}`,
    },
  };
  const nextSpy = jest.fn();

  beforeAll(async () => {
    await db.init();
    await db.run(
      "INSERT INTO users VALUES (?, ?)",
      signedUpUser.id,
      signedUpUser.tier
    );
  });

  afterAll(async () => {
    await db.run("DELETE FROM users WHERE id = ?", signedUpUser.id);
    await db.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("given a signed up user, when a valid token is provided, then it populates the user in the request", async () => {
    const req = { ...signedUpRequest };
    await authMiddleware(config.JWT_SECRET)(req, undefined, nextSpy);
    expect(req).toHaveProperty("user.id", signedUpUser.id);
    expect(req).toHaveProperty("user.tier", signedUpUser.tier);
    expect(nextSpy).toHaveBeenCalled();
  });

  it("given a signed up user, when an invalid token is provided, then it returns an error", async () => {
    const req = { headers: { authorization: "invalid_token" } };
    await authMiddleware(config.JWT_SECRET)(req, undefined, nextSpy);
    expect(req).not.toHaveProperty("user");
    expect(nextSpy).toHaveBeenCalledWith(new Error("jwt malformed"));
  });

  it("given an anonymous user, when no token is provided, then it returns an error", async () => {
    const req = { headers: {} };
    await authMiddleware(config.JWT_SECRET)(req, undefined, nextSpy);
    expect(req).not.toHaveProperty("user");
    expect(nextSpy).toHaveBeenCalledWith(new Error("Missing auth token"));
  });
});
