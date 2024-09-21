// Libraries
import { createClient, RedisClientType } from 'redis';

export default class RedisDbConnection {
    public client: RedisClientType | null = null;

    connect = async () => {
        this.client = createClient({
            password: process.env.REDIS_PASSWORD || '',
            socket: {
                host: process.env.REDIS_URI || 'redis://redis',
                port: Number(process.env.REDIS_PORT) || 6379
            }
        });

        this.listener();

        await this.client.connect();
    };

    disconnect = async () => {
        await this.client.disconnect();
    };

    private listener = () => {
        const prefix = '::: Redis ::: ';

        this.client.on('error', (err) => console.log('Error', err));
        this.client.on('connect', () => console.log(prefix + '::: connected'));
        this.client.on('reconnect', () => console.log(prefix + '::: re-connected'));
        this.client.on('ready', () => console.log(prefix + '::: ready'));
    };
}

export const redisDbConnection = new RedisDbConnection();
