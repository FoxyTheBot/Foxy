import { logger } from '../../../common/utils/logger';
import FoxyInstance from './FoxyInstance';

require('dotenv').config({ path: '../../.env' });

const botInstance = new FoxyInstance();
const bot = botInstance.bot;

export { bot };

process.on('unhandledRejection', (err: Error) => {
    logger.error(err);
});

process.on('SIGINT', async () => {
    await botInstance.shutdown();
    logger.info('Process terminated');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await botInstance.shutdown();
    logger.info('Process terminated');
    process.exit(0);
});

process.on('uncaughtException', (err) => {
    logger.criticalError(err.stack);
});