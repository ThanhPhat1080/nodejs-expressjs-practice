import { UserController } from "@/controllers";
import { verifyAccessTokenMiddleware } from "@/helpers/jwt";
import { Router } from "express";

const userRouter = Router();

const controller = new UserController();
const {
    createUser,
    getUsers,
    getById,
    login
 } = controller;

/**
 * The Router here
 */
userRouter.post("/register", createUser);
userRouter.get("/", verifyAccessTokenMiddleware, getUsers);
userRouter.get("/:id", getById);
userRouter.post("/login", login);

export default userRouter;