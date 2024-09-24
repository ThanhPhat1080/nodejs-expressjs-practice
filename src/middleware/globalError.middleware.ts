import { Express, NextFunction, Request, Response } from 'express';
import CreateErrorMiddleware, { HttpError } from 'http-errors';

// Helpers
import logEvents from '@/helpers/logEvents';

export const notFoundMiddleware = (next: NextFunction) => {
    next(CreateErrorMiddleware.NotFound('Not found!'));
};

export const globalErrorMiddleware = (err: HttpError, req: Request, res: Response) => {
    logEvents(`Error --- Status: ${err.status} - ${err.message}\t[path: ${req.url} | method: ${req.method}]`);

    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message,
    });
};
