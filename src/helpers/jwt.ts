import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import JWT, { JwtPayload } from 'jsonwebtoken';
import { redisDBConnection } from '@/dataHelpers';
import { IUser, USER_ROLES } from '@/models/user.model';

const signAccessToken = async (user: IUser) => {
    return new Promise((resolve, reject) => {
        const payload = {
            sub: user._id,
            role: user.role || USER_ROLES.USER,
            right: user.right
        };
        const options = {
            expiresIn: '10m', // 10m to testing purpose
        };

        JWT.sign(payload, process.env.ACCESS_TOKEN as string, options, (error, token) => {
            if (error) reject(error);

            resolve(token);
        });
    });
};

const signRefreshToken = async (userId: string) => {
    return new Promise((resolve, reject) => {
        const payload = {
            sub: userId,
        };
        const options = {
            expiresIn: '7d',
        };

        JWT.sign(payload, process.env.REFRESH_TOKEN as string, options, async (error, token) => {
            if (error) reject(error);

            // Set token to redisDB
            const expiresInSecond = 7 * 24 * 60 * 60;
            try {
                await redisDBConnection.client.set(userId.toString(), token, { EX: expiresInSecond });

                resolve(token);
            } catch {
                reject(createHttpError.InternalServerError());
            }
        });
    });
};

// TODO: make it become filter
const verifyRefreshToken = async (refreshToken: string): Promise<JwtPayload> => {
    return new Promise((resolve, reject) => {
        JWT.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, payload: JwtPayload) => {
            if (err) {
                return reject(err);
            }

            try {
                const reply = await redisDBConnection.client.get(payload.userId.toString());
                if (reply === refreshToken) {
                    return resolve(payload);
                }
            } catch {
                return reject(createHttpError.InternalServerError());
            }

            return reject(createHttpError.Unauthorized());
        });
    });
};

export { signAccessToken, signRefreshToken, verifyRefreshToken };
