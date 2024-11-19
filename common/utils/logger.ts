import * as fs from 'fs';
import * as path from 'path';

const createLogDirectory = () => {
    const logDirectory = path.resolve(process.cwd(), 'logs');
    
    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory, { recursive: true });
    }
};

const logToFile = (level: string, message: string) => {
    const logDirectory = path.resolve(process.cwd(), 'logs');
    const currentDate = new Date().toISOString().split('T')[0];
    const logFilePath = path.join(logDirectory, `foxy-logs-${currentDate}.log`);
    const timestamp = new Date().toISOString();

    const logMessage = `[${timestamp}] [${level}] > ${message}\n`;

    fs.appendFileSync(logFilePath, logMessage, { encoding: 'utf8' });
};

const logger = {
    error: (...args: any[]): void => {
        const message = args.join(' ');
        const timestamp = `[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] \u001b[31mERROR\u001b[0m > ${message}`;
        console.error(timestamp);
        createLogDirectory();
        logToFile('ERROR', message);
    },

    info: (...args: any[]): void => {
        const message = args.join(' ');
        const timestamp = `[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] \u001b[94mINFO\u001b[0m > ${message}`;
        console.info(timestamp);
        createLogDirectory();
        logToFile('INFO', message);
    },

    warn: (...args: any[]): void => {
        const message = args.join(' ');
        const timestamp = `[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] \u001b[33mWARN\u001b[0m > ${message}`;
        console.warn(timestamp);
        createLogDirectory();
        logToFile('WARN', message);
    },

    debug: (...args: any[]): void => {
        const message = args.join(' ');
        const timestamp = `[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] \u001b[36mDEBUG\u001b[0m > ${message}`;
        console.debug(timestamp);
        createLogDirectory();
        logToFile('DEBUG', message);
    },

    criticalError: (...args: any[]): void => {
        const message = args.join(' ');
        const timestamp = `[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] \u001b[91mCRITICAL ERROR\u001b[0m > ${message}`;
        console.error(timestamp);
        createLogDirectory();
        logToFile('CRITICAL ERROR', message);
    },

    log: (...args: any[]): void => {
        const message = args.join(' ');
        console.log(message);
        createLogDirectory();
        logToFile('LOG', message);
    },
};

export { logger };
