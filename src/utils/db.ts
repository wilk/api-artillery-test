import { PromisedDatabase } from "promised-sqlite3";
import config from "./config";

export class Database {
  private db: PromisedDatabase;
  private connection: string;

  constructor(db: PromisedDatabase, connection: string) {
    this.db = db;
    this.connection = connection;
  }

  static make(connection: string) {
    return new Database(new PromisedDatabase(), connection);
  }

  init() {
    return this.db.open(this.connection);
  }

  run(sql: string, ...params: any[]) {
    return this.db.run(sql, ...params);
  }

  findOne(sql: string, ...params: any[]) {
    return this.db.get(sql, ...params);
  }

  findAll(sql: string, ...params: any[]) {
    return this.db.all(sql, ...params);
  }

  close() {
    return this.db.close();
  }
}

export const db = Database.make(`data/${
  config.NODE_ENV === "test" ? config.DB_URL_TEST : config.DB_URL
}
  `);
