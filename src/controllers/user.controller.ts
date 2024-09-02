import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import UserModel, { User } from "@/models/user.model";
import { UserService } from "@/services";
import { BaseController } from "./base.controller";

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

            const existUsers = await UserService.select({
                email
            });

            if (existUsers[0]) {
                throw createHttpError.Conflict(`${email} is ready registed!`)
            }

            const newUser = new UserModel({
                email,
                name,
                password
            });

            const savedUser = await UserService.save(newUser);

            return res.json(savedUser);
        } catch (error) {
            next(error);
        }
    }

    getUsers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            let result = [];
            
            if (!Object.keys(req.query).length) {
                result = await UserService.getAll();
            } else {
                result = await UserService.select(req.query);
            }

            return res.json(result);
        } catch (error) {
            next(error);
        }
    }

};

export default UserController;