// Libraries
import { createClient, RedisClientType } from 'redis';
import { config as dotenvConfig } from 'dotenv';

// Configs
import databaseConfigs from '@/configs/database.configs';

// Config dotenv
dotenvConfig();

export default class RedisDBConnection {
    public client: RedisClientType | null = null;
    private connectionConfig: any = '';

    constructor(connectionConfig: any) {
        this.connectionConfig = connectionConfig;
    }

    connect = async () => {
        this.client = createClient(this.connectionConfig);
        this.listener();

        await this.client.connect();
    };

    private listener = () => {
        const prefix = '::: Redis ::: ';

        this.client.on('error', (err) => console.log(prefix + '::: error', err));
        this.client.on('connect', () => console.log(prefix + '::: connected'));
        this.client.on('reconnect', () => console.log(prefix + '::: re-connected'));
        this.client.on('ready', () => console.log(prefix + '::: ready'));
        this.client.on('disconnect', () => console.log(prefix + '::: disconnect'));
    };
}

export const redisDBConnection = new RedisDBConnection(
    process.env.NODE_ENV === 'development' ? databaseConfigs.redis.local : databaseConfigs.redis.server,
);
