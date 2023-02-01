import Express from "express";
import { UsersService } from "./service.users";
import { Database } from "../utils/db";

export class UsersController {
  private usersService: UsersService;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  static make(db: Database) {
    return new UsersController(UsersService.make(db));
  }

  async getUsers(_req: Express.Request, res: Express.Response) {
    const users = await this.usersService.findUsers();
    res.json(users);
  }
}
