import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import UserModel, { User } from "@/models/user.model";
import { BaseController } from "./base.controller";
import { UserService } from "@/services";
import { Model } from "mongoose";

class UserController extends BaseController<User, typeof UserService> {
    constructor() {
        super(UserService);
    }

    createUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { email, password, name } = req.body;

            if (!email || !password) {
                throw createHttpError.BadRequest();
            }

            const existUser = await UserService.get({
                email
            });

            if (existUser) {
                throw createHttpError.Conflict(`${email} is ready registed!`)
            }

            const newUser = await UserService.create({
                name,
                password,
                email,
                age: 0,
                avatar: ''
            });

            return res.json(newUser);
        } catch (error) {
            next(error);
        }

    }
};

export default UserController;