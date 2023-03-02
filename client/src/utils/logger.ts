const date = new Date();

const logger = {
    error: (...args: any[]): void => {
        console.error(`[${date.toLocaleDateString()} ${date.toLocaleTimeString()}] \u001b[31mERROR]\u001b[0m >`, ...args);
    },

    info: (...args: any[]): void => {
        console.info(`[${date.toLocaleDateString()} ${date.toLocaleTimeString()}] \u001b[94mINFO\u001b[0m >`, ...args);
    },

    warn: (...args: any[]): void => {
        console.warn(`[${date.toLocaleDateString()} ${date.toLocaleTimeString()}] \u001b[33mWARN\u001b[0m >`, ...args);
    },

    criticalError: (...args: any[]): void => {
        console.error(`[${date.toLocaleDateString()} ${date.toLocaleTimeString()}] \u001b[91mCRITICAL ERROR\u001b[0m >`, ...args);
        process.exit(1);
    },

    log: (...args: any[]): void => {
        console.log(...args);
    }
}

export { logger };