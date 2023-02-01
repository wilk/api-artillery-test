import { User } from "../auth/types";
import { Database } from "../utils/db";

export class UsersService {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  static make(db: Database) {
    return new UsersService(db);
  }

  async findUsers(): Promise<User[]> {
    return this.db.findAll("SELECT * FROM users");
  }
}
