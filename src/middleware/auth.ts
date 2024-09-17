import { IUser, USER_ROLES } from '@/models/user.model';
import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import JWT, { JwtPayload } from 'jsonwebtoken';

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

        const user = {
            id: payload.sub,
            role: payload.role,
        } as Partial<IUser>;

        req.body = {
            ...req.body,
            user,
        };

        next();
    });
};

const withRoles = (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const { user }: { user: Partial<IUser> } = req.body;
    const userRole = user?.role;

    if (!userRole) {
        return next(createHttpError.Unauthorized());
    }

    if (userRole === USER_ROLES.SUPER_USER || roles.includes(userRole)) {
        return next();
    }

    return next(createHttpError.Unauthorized());
};

export { withRoles, verifyAccessTokenFilter };
