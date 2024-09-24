import fs from 'fs';
import path from 'path';

const fileName = path.join(__dirname, '../../logs', 'log.log');

const logEvents = async (msg: string) => {
    try {
        const content = `\n### @${new Date().getTime()}\t[${new Date().toUTCString()}]\t${msg}`;
        fs.appendFile(fileName, content, () => {});
    } catch (error) {
        console.log('[server] log error:', error);
    }
};

export default logEvents;