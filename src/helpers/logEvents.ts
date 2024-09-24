import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, '../../logs', 'log.log');

const logEvents = async (msg: string) => {
    try {
        const newContent = `\n### @${new Date().getTime()}\t[${new Date().toUTCString()}]\t${msg}`;
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }

            const updatedContent = newContent + data;

            fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                console.log('Content prepended successfully!');
            });
        });
    } catch (error) {
        console.log('[server] log error:', error);
    }
};

export default logEvents;
