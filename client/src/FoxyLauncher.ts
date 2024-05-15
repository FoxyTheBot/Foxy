import { logger } from './utils/logger';
import FoxyInstance from './structures/client/FoxyInstance';

const bot = new FoxyInstance().bot;
export { bot };

process.on('unhandledRejection', (err: Error) => {
    return logger.error(err);
});

process.on('uncaughtException', (err) => {
    logger.criticalError(err.stack);
});