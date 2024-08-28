// Libraries
import mongoose, {Connection} from 'mongoose';

export default class MongoDbConnection {
    private connectionString: string = '';
    private connection: Connection | undefined;

    constructor(connectionString: string) {
        this.connectionString = connectionString;
    };

    connect = async () => {
        this.connection = mongoose.createConnection(this.connectionString);
    };

    disconnect = async () => {
        this.connection?.close();
    }

    listenerEvents = () => {
        const prefix = '-- Mongodb::: ';

         this.connection?.on('connected', () => console.log(prefix + 'Connected'));
         this.connection?.on('open', () => console.log(prefix + 'Open'));
         this.connection?.on('disconnected', () => console.log(prefix + 'Disconnected'));
         this.connection?.on('reconnected', () => console.log(prefix + 'Reconnected'));
         this.connection?.on('disconnecting', () => console.log(prefix + 'Disconnecting'));
         this.connection?.on('close', () => console.log(prefix + 'Close'));

         process.on('SIGINT', async () => {
            await this.connection?.close();
            process.exit();
         })
    }
};
