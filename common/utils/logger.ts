const logger = {
    error: (...args: any[]): void => {
        console.error(`[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] \u001b[31mERROR\u001b[0m >`, ...args);
    },

    info: (...args: any[]): void => {
        console.info(`[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] \u001b[94mINFO\u001b[0m >`, ...args);
    },

    warn: (...args: any[]): void => {
        console.warn(`[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] \u001b[33mWARN\u001b[0m >`, ...args);
    },

    criticalError: (...args: any[]): void => {
        console.error(`[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] \u001b[91mCRITICAL ERROR\u001b[0m >`, ...args);
    },

    log: (...args: any[]): void => {
        console.log(...args);
    },
}

export { logger };