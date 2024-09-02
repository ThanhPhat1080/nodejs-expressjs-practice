import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import JWT from 'jsonwebtoken'

const signinAccessToken = async (userId: string) => {
    return new Promise((resolve, reject) => {
        const payload = {
            userId
        };
        const secret = process.env.ACCESS_TOKEN as string;
        const options = {
            expiresIn: '1h'
        };

        JWT.sign(
            payload,
            process.env.ACCESS_TOKEN as string,
            options,
            (error, token) => {
                if (error) reject(error);

                resolve(token);
            }
        );
    })
}

const verifyAccessTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization'] as string;
console.log(req.headers);

    if (!auth) {
        return next(createHttpError.Unauthorized());
    }

    const token = auth.split(' ')[1];

    // Verify token
    JWT.verify(
        token,
        process.env.ACCESS_TOKEN as string,
        (err, payload) => {
            if (err) {
                console.log(err);
                
                return next(createHttpError.Unauthorized());
            }
            req.payload = payload;

            next();
        }
    );


}
export {
    signinAccessToken,
    verifyAccessTokenMiddleware
};