import { config as dotenvConfig } from 'dotenv';
import app from './app';

// Config dotenv
dotenvConfig();

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('[server]: Server is running on NODE_ENV =', process.env.NODE_ENV);
    console.log(`[server]: Server is running at PORT: ${port}`);
});
