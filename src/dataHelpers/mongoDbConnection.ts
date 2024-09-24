// Libraries
import mongoose, { Connection } from 'mongoose';

// Configs
import databaseConfigs from '@/configs/databaseConfigs';

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
    };

    disconnect = async () => {
        await mongoose.disconnect();
    };
}

export const mongoDBConnection = new MongoDbConnection(databaseConfigs.mongoDB.connectionString);
