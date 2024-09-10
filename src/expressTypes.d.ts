declare namespace Express {
    export interface Request {
        payload: any;
    }

    export interface Response {
        locals: {
            result: any;
        }
    }
}
