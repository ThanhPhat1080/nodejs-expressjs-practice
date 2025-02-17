// Libraries
import mongoose, { CacheOptions, Connection } from 'mongoose';

// Configs
import databaseConfigs from '@/configs/database.configs';
import { redisDBConnection } from './redisDbConnection';

export default class MongoDbConnection {
    private connectionString: string = '';

    constructor(connectionString: string) {
        this.connectionString = connectionString;
    }

    connect = () => {
        const prefix = '::: Mongodb ::: ::: ';

        mongoose.connection.on('connected', () => console.log(prefix + 'connected'));
        mongoose.connection.on('open', () => console.log(prefix + 'open'));
        mongoose.connection.on('disconnected', () => console.log(prefix + 'disconnected'));
        mongoose.connection.on('reconnected', () => console.log(prefix + 'reconnected'));
        mongoose.connection.on('disconnecting', () => console.log(prefix + 'disconnecting'));
        mongoose.connection.on('close', () => console.log(prefix + 'close'));

        const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

        // @ts-ignore
        mongoose.connect(this.connectionString, clientOptions);

        this.customMongooseWithCachingStrategy();
    };

    disconnect = async () => {
        await mongoose.disconnect();
    };

    customMongooseWithCachingStrategy = () => {
        const redisClient = redisDBConnection.client;

        const exec = mongoose.Query.prototype.exec;

        mongoose.Query.prototype.cache = function (options: CacheOptions = {}) {
            this.__useCache = true;
            this.__expired = options.expired || 60;

            return this; //make cache() chainable
        };

        mongoose.Query.prototype.exec = async function () {
            // NO-CACHE
            if (this.__useCache) {
                return await exec.apply(this, arguments);
            }

            const collectionName = this.mongooseCollection.name;

            const key = JSON.stringify(Object.assign({}, this.getQuery(), { collection: collectionName }));
            const cacheValue = await redisClient.get(key);

            if (cacheValue) {
                // Should return a mongoose model
                const objectValue = JSON.parse(cacheValue.toString());

                return Array.isArray(objectValue)
                    ? objectValue.map((x) => new this.model(x))
                    : new this.model(objectValue);
            }

            // "result" is mongoose model
            const result = await exec.apply(this, arguments);

            redisClient.set(key, JSON.stringify(result), {
                expiration: { type: 'EX', value: this.__expired }
            });

            return result;
        };
    };
}

export const mongoDBConnection = new MongoDbConnection(databaseConfigs.mongoDB.connectionString);

