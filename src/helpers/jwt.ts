import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import JWT, { JwtPayload } from 'jsonwebtoken';
import { redisDbConnection } from '@/dataHelpers';

const signAccessToken = async (userId: string) => {
    return new Promise((resolve, reject) => {
        const payload = {
            userId,
        };
        const options = {
            expiresIn: '1m', // 10s to testing purpose
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
            userId,
        };
        const options = {
            expiresIn: '7d',
        };

        JWT.sign(payload, process.env.REFRESH_TOKEN as string, options, async (error, token) => {
            if (error) reject(error);

            // Set token to redis
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

const verifyAccessTokenFilter = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization'] as string;

    if (!auth) {
        return next(createHttpError.Unauthorized());
    }

    const token = auth.split(' ')[1];

    // Verify token
    JWT.verify(token, process.env.ACCESS_TOKEN as string, (err, payload: JwtPayload) => {
        if (err) {
            return next(createHttpError.Unauthorized(err.message));
        }
        req.payload = payload;

        next();
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

export { signAccessToken, verifyAccessTokenFilter, signRefreshToken, verifyRefreshToken };
