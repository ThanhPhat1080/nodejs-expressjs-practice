import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import JWT, { JwtPayload } from 'jsonwebtoken';
import { redisDbConnection } from '@/dataHelpers';
import { USER_ROLES } from '@/models/user.model';

const signAccessToken = async (userId: string, role: string | USER_ROLES) => {
    return new Promise((resolve, reject) => {
        const payload = {
            sub: userId,
            role,
        };
        const options = {
            expiresIn: '1m', // 1m to testing purpose
        };

        JWT.sign(payload, process.env.ACCESS_TOKEN as string, options, (error, token) => {
            if (error) reject(error);

            resolve(token);
        });
    });
};

const signRefreshToken = async (userId: string, role: string | USER_ROLES) => {
    return new Promise((resolve, reject) => {
        const payload = {
            sub: userId,
            role,
        };
        const options = {
            expiresIn: '7d',
        };

        JWT.sign(payload, process.env.REFRESH_TOKEN as string, options, async (error, token) => {
            if (error) reject(error);

            // Set token to redisDB
            const expiresInSecond = 7 * 24 * 60 * 60;
            try {
                await redisDbConnection.client.set(userId.toString(), token, { EX: expiresInSecond });

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
                const reply = await redisDbConnection.client.get(payload.userId.toString());
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
