// Libraries
import express, { Router } from 'express';
import { config as dotenvConfig } from 'dotenv';

// Swagger
import swaggerConfig from './swagger.json';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import CreateErrorMiddleware, { HttpError } from 'http-errors';

// DB
import { MongoDbConnection, redisDbConnection } from './dataHelpers';
import '@/dataHelpers/redisDbConnection';

// Types
import type { Express, NextFunction, Request, Response } from 'express';

// Routers
import { userRouter, projectRouter } from './routers';

// Config dotenv
dotenvConfig();

const app: Express = express();
const port = process.env.PORT || 3000;

const mongodbService = new MongoDbConnection((process.env.MONGO_URI as string) || 'mongodb://0.0.0.0:27017/local');
mongodbService.connect();

redisDbConnection.connect();

// Config Swagger
const swaggerSpec = swaggerJSDoc(swaggerConfig);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

// Routers
const appRouters = Router();
appRouters.use('/user', userRouter);
appRouters.use('/project', projectRouter);

app.use('/api', appRouters);

app.use((req: Request, res: Response, next: NextFunction) => {
    next(CreateErrorMiddleware.NotFound('Not found!'));
});

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message,
    });
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

process.on('SIGINT', async () => {
    await mongodbService.disconnect();
    // await redisDbService.disconnect();
});
