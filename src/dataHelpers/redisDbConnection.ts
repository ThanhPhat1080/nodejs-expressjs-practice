// Libraries
import { createClient, RedisClientType } from 'redis';

export default class RedisDbConnection {
    public client: RedisClientType | null = null;

    connect = async () => {
        this.client = createClient({
            url: process.env.REDIS_URI as string,
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
redisDbConnection.connect();
