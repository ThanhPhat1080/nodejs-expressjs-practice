const configs = {
    mongoDB: {
        connectionString: (process.env.MONGO_URI as string) || 'mongodb://0.0.0.0:27017/local',
    },
    redis: {
        local: {
            url: (process.env.REDIS_URI as string) || 'redis://localhost:6379',
        },
        server: {
            password: process.env.REDIS_PASSWORD || '',
            socket: {
                host: process.env.REDIS_URI,
                port: Number(process.env.REDIS_PORT),
            },
        },
    },
};

export default configs;
