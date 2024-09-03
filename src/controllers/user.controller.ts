import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import UserModel, { User } from '@/models/user.model';
import { UserService } from '@/services';
import { BaseController } from './base.controller';
import { signinAccessToken, signRefreshToken } from '@/helpers/jwt';

class UserController extends BaseController<User, typeof UserService> {
    constructor() {
        super(UserService);
    }

    createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password, name } = req.body;

            if (!email || !password) {
                throw createHttpError.BadRequest();
            }

            const existUsers = await UserService.select({
                email,
            });

            if (existUsers[0]) {
                throw createHttpError.Conflict(`${email} is ready registed!`);
            }

            const newUser = new UserModel({
                email,
                name,
                password,
            });

            const savedUser = await UserService.save(newUser);

            return res.json(savedUser);
        } catch (error) {
            next(error);
        }
    };

    getUsers = async (req: Request, res: Response, next: NextFunction) => {
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
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;

            const user = await UserService.getOne({ email });
            if (!user) {
                throw createHttpError.NotFound('User not regirsted!');
            }

            const isMatchPassword = await user.checkPassword(password);

            if (!isMatchPassword) {
                throw createHttpError.BadRequest('Password is not correct!');
            }

            const accessToken = await signinAccessToken(user._id as string);
            const refeshToken = await signRefreshToken(user._id as string);

            return res.json({ accessToken, refeshToken });
        } catch (error) {
            next(error);
        }
    };
}

export default UserController;
