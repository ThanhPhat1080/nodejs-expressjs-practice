// Libraries
import { createClient, RedisClientType } from 'redis';
import { config as dotenvConfig } from 'dotenv';

// Config dotenv
dotenvConfig();

export default class RedisDbConnection {
    public client: RedisClientType | null = null;

    connect = async () => {
        const redisClient = process.env.NODE_ENV === 'development'
            ? {
                url: process.env.REDIS_URI as string,
            }
            : {
                password: process.env.REDIS_PASSWORD || '',
                socket: {
                host: process.env.REDIS_URI,
                port: Number(process.env.REDIS_PORT),
            }
        }

        this.client = createClient(redisClient);
        this.listener();

        await this.client.connect();
    };

    disconnect = async () => {
        await this.client.disconnect();
    };

    private listener = () => {
        const prefix = '::: Redis ::: ';

        this.client.on('error', (err) => console.log(prefix + '::: error', err));
        this.client.on('connect', () => console.log(prefix + '::: connected'));
        this.client.on('reconnect', () => console.log(prefix + '::: re-connected'));
        this.client.on('ready', () => console.log(prefix + '::: ready'));
    };
}

export const redisDbConnection = new RedisDbConnection();
