import { Router } from "express";
import { UsersController } from "./controller.users";
import { db } from "../utils/db";

const usersRouter = Router();

const usersController = UsersController.make(db);

usersRouter.get("/", (req, res) => usersController.getUsers(req, res));

export { usersRouter };
