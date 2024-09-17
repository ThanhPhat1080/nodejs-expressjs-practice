import { JwtPayload } from 'jsonwebtoken';
import { IUser } from './models/user.model';

declare namespace Express {
    export interface Request {
        payload?: JwtPayload;
        user?: Partial<IUser>;
    }

    export interface Response {
        locals: {
            result: any;
        };
    }
}
