// Libraries
import express from 'express';
import { config } from 'dotenv';
import mongoose from 'mongoose';

import { MongoDbConnection } from './dataHelpers'

import CreateErrorMiddleware, { HttpError, HttpErrorConstructor } from 'http-errors';

// Types
import type { Express, NextFunction, Request, Response } from 'express';
import { log } from 'console';


// Routers
import userRouter from './routers/user.router';

config();

const app: Express = express();
const port = process.env.PORT || 3000;

const mongodbService = new MongoDbConnection('mongodb://127.0.0.1:27017/wishfit');
mongodbService.connect();
mongodbService.listenerEvents();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.use((req: Request, res: Response, next: NextFunction) => {
    next(CreateErrorMiddleware.NotFound("Not found!"));
});

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    res.json({
        status: err.status || 500,
        message: err.message
    })
});

// Routers
app.use('/user', userRouter);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});