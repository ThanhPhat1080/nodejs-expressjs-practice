import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import UserModel, { IUser } from '@/models/user.model';
import { UserService } from '@/services';
import { BaseController } from './base.controller';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/helpers/jwt';
import { redisDbConnection } from '@/dataHelpers';

class UserController extends BaseController<IUser, typeof UserService> {
    constructor() {
        super(UserService);
    }

    createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password, name } = req.body;

            if (!email || !password) {
                throw createHttpError.BadRequest();
            }

            const existUser = await UserService.getOne({ email }, { isExact: true });

            if (existUser) {
                throw createHttpError.Conflict(`${email} is ready register!`);
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
            const { limit, page, embed = 'false', ...criteria } = req.query;

            const options = {
                select: '-password',
                pagination: {
                    limit: Number(limit),
                    page: Number(page),
                },
                embed: (embed as string).toLowerCase() === 'false',
            };
            const result = await UserService.getMany(criteria, options);

            return res.json(result);
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;

            const user = await UserService.getOne({ email }, { isExact: true });
            if (!user) {
                throw createHttpError.NotFound('User not register!');
            }

            const isMatchPassword = await user.checkPassword(password);

            if (!isMatchPassword) {
                throw createHttpError.BadRequest('Password is not correct!');
            }

            const accessToken = await signAccessToken(user._id as string);
            const refreshToken = await signRefreshToken(user._id as string);

            return res.json({ accessToken, refreshToken });
        } catch (error) {
            next(error);
        }
    };

    refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) throw createHttpError.BadRequest();

            const { userId } = await verifyRefreshToken(refreshToken);
            const newAccessToken = await signAccessToken(userId);
            const newRefreshToken = await signRefreshToken(userId);

            res.json({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            });
        } catch (error) {
            next(createHttpError.BadRequest());
        }
    };

    logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) throw createHttpError.BadRequest();

            const { userId } = await verifyRefreshToken(refreshToken);

            try {
                await redisDbConnection.client.del(userId.toString());

                res.json({
                    message: 'Logout!',
                });
            } catch (err) {
                throw createHttpError.InternalServerError(err);
            }
        } catch (error) {
            next(error);
        }
    };
}

export default UserController;
