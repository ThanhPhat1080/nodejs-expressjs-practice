// Libraries
import express from 'express';
import { config as dotenvConfig } from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

// DB
import { mongoDBConnection, redisDBConnection } from '@/dataHelpers';

// Types
import type { Express, Request, Response } from 'express';

// Routers
import appRouters from './routers';

// Helpers
import { notFoundMiddleware, globalErrorMiddleware } from './middleware/globalError.middleware';
import { configSwaggerUI } from './configs/swagger.configs';

// Config dotenv
dotenvConfig();

const app: Express = express();
const port = process.env.PORT || 3000;

// Connect Databases
mongoDBConnection.connect();
redisDBConnection.connect();

// Config middlewares
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

app.listen(port, () => {
    console.log('[server]: Server is running on NODE_ENV =', process.env.NODE_ENV);
    console.log(`[server]: Server is running at PORT: ${port}`);
});

process.on('SIGINT', () => {
    mongoDBConnection.disconnect();
    redisDBConnection.client.quit();
});
