// Libraries
import { createClient } from 'redis';

export default class RedisDbConnection {
    private client;
    // private host = '';

    // constructor(host: string) {
    //     this.host = host;
    // }

    connect = async () => {
        this.client = createClient();
        
        this.listener();
        
        await this.client.connect();
    };
    
    disconnect = async () => {
        await this.client.disconnect();
    }
    
    private listener = () => {
        const prefix = '::: Redis ::: ';

        this.client.on('error', err => console.log('Error', err));
        this.client.on('connect', () => console.log(prefix + '::: connected'));
        this.client.on('ready', () => console.log(prefix + '::: ready'));
    }
}
