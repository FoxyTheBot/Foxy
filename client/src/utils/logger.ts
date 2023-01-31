const logger = {
    error: (...args: any[]): void => {
        console.error(`\u001b[31m[ERROR]\u001b[0m -`, ...args);
    },

    info: (...args: any[]): void => {
        console.info(`\u001b[94m[INFO]\u001b[0m -`, ...args);
    },

    success: (eventDescription: string, eventName?: string): void => {
        console.info(`\u001b[32m[${eventName || "READY"}]\u001b[0m -`, eventDescription);
    },

    warn: (...args: any[]): void => {
        console.warn(`\u001b[33m[WARN]\u001b[0m -`, ...args);
    },

    criticalError: (...args: any[]): void => {
        console.error(`\u001b[91m[CRITICAL ERROR]\u001b[0m -`, ...args);
        process.exit(1);
    },

    log: (...args: any[]): void => {
        console.log(...args);
    }
}

export { logger };