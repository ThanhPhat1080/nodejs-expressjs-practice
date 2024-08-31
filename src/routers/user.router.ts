import { UserController } from "@/controllers";
import { Router } from "express";

const userRouter = Router();

const controller = new UserController();
const {
    createUser,
    getUsers,
    getById 
 } = controller;

/**
 * The Router here
 */
userRouter.post("/register", createUser);
userRouter.get("/", getUsers);
userRouter.get("/:id", getById);

export default userRouter;