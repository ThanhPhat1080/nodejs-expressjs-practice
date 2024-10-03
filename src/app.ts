// Libraries
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

// DB
import { mongoDBConnection, redisDBConnection } from '@/dataHelpers';

// Types
import type { Express, Request, Response } from 'express';

// Routers
import appRouters from './routers';

// Helpers
import { notFoundMiddleware, globalErrorMiddleware } from './middleware/globalError.middleware';
import { configSwaggerUI } from './configs/swagger.configs';

const app: Express = express();

// Connect Databases
mongoDBConnection.connect();
redisDBConnection.connect();

// Config middlewares
app.use(cors({
    origin: '*'
}));
configSwaggerUI(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // Hidden metadata on header
app.use(morgan('common')); // For debug logger

// Routers
app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});
app.use('/api/v1', appRouters);

// Config global-error catching
app.use(notFoundMiddleware);
app.use(globalErrorMiddleware);

process.on('SIGINT', () => {
    mongoDBConnection.disconnect();
    redisDBConnection.client.quit();
});

export default app;
