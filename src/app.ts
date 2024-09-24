// Libraries
import express, { Router } from 'express';
import { config as dotenvConfig } from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

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
import logEvents from './helpers/log';

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

// Hidden metadata on header
app.use(helmet());

// For debug logger
app.use(morgan('common'));

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

// Routers
const appRouters = Router();
appRouters.use('/user', userRouter);
appRouters.use('/project', projectRouter);

app.use('/api/v1', appRouters);

app.use((req: Request, res: Response, next: NextFunction) => {
    next(CreateErrorMiddleware.NotFound('Not found!'));
});

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logEvents(`[path: ${req.url} | method: ${req.method}]\tError --- Status: ${err.status} - ${err.message}`);

    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message,
    });
});


app.listen(port, () => {
    console.log("[server]: Server is running on NODE_ENV =", process.env.NODE_ENV);
    console.log(`[server]: Server is running at PORT: ${port}`);
});

process.on('SIGINT', async () => {
    await mongodbService.disconnect();
    // await redisDbService.disconnect();
});
