import { NextFunction, Request, Response } from "express";
 import createHttpError from "http-errors";
import UserModel from "../models/user.model";


class UserController {
    constructor() {

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

            const isExists = await UserModel.findOne({
                email
            });

            if (isExists) {
                throw createHttpError.Conflict(`${email} is ready registed!`)
            }

            const newUser = await UserModel.create({
                name,
                password,
                email,
                age: 0,
                avatar: ''
            });

            return res.json(newUser);

        } catch(error) {
            next(error);
        }

    }
};

export default UserController;