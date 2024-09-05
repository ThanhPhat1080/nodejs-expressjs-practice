// Libraries
import mongoose, { Connection } from 'mongoose';

export default class MongoDbConnection {
    private connectionString: string = '';
    private connection: Connection | undefined;

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

        mongoose.connect(this.connectionString);
    };

    disconnect = async () => {
        await mongoose.disconnect();
    };
}
