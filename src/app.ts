// Libraries
import * as express from 'express';
import { config } from 'dotenv';

import { MongoDbConnection } from './dataHelpers';

import CreateErrorMiddleware, { HttpError, HttpErrorConstructor } from 'http-errors';

// Types
import type { Express, NextFunction, Request, Response } from 'express';

// Routers
import userRouter from './routers/user.router';

config();

const app: Express = express();
const port = process.env.PORT || 3000;

const mongodbService = new MongoDbConnection((process.env.MONGO_URI as string) || 'mongodb://localhost:27017/local');
mongodbService.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

// Routers
app.use('/user', userRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    next(CreateErrorMiddleware.NotFound('Not found!'));
});

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    res.json({
        status: err.status || 500,
        message: err.message,
    });
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
