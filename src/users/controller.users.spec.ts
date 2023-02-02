import request from "supertest";
import { v4 as uuid } from "uuid";
import { app } from "../app";
import { db } from "../utils/db";
import { ServiceAuth } from "../auth/service.auth";

describe("Users API", () => {
  const serviceAuth = ServiceAuth.make();

  describe("getUsers()", () => {
    const users = [
      {
        id: uuid(),
        tier: "platinum",
      },
      {
        id: uuid(),
        tier: "gold",
      },
      {
        id: uuid(),
        tier: "silver",
      },
    ];

    const authToken = serviceAuth.createToken({
      sub: users[0].id,
      tier: users[0].tier,
    });

    beforeAll(async () => {
      await db.init();
    });

    beforeEach(async () => {
      await Promise.all(
        users.map((u) =>
          db.run("INSERT INTO users VALUES (?, ?)", u.id, u.tier)
        )
      );
    });

    afterEach(async () => {
      await Promise.all(
        users.map((u) => db.run("DELETE FROM users WHERE id = ?", u.id))
      );
    });

    afterAll(async () => {
      await db.close();
    });

    it("returns the list of users", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3);
      expect(res.body).toEqual(
        expect.arrayContaining([expect.objectContaining(users[0])])
      );
    });
  });
});
