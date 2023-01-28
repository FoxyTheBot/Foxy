const logger = {
    error: (...args: any[]): void => {
        console.error(`\u001b[31m[ERROR]\u001b[0m -`, ...args);
    },

    info: (...args: any[]): void => {
        console.info(`\u001b[94m[INFO]\u001b[0m -`, ...args);
    },

    success: (...args: any[]): void => {
        console.info(`\u001b[32m[READY]\u001b[0m -`, ...args);
    },

    databaseSuccess: (...args: any[]): void => {
        console.info(`\u001b[32m[DATABASE]\u001b[0m -`, ...args);
    },

    localeSuccess: (...args: any[]): void => {
        console.info(`\u001b[32m[LOCALES]\u001b[0m -`, ...args);
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