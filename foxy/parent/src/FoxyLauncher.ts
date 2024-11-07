import { logger } from '../../../common/utils/logger';
import FoxyInstance from './FoxyInstance';

require('dotenv').config({ path: '../../.env' });

const bot = new FoxyInstance().bot;
export { bot };

process.on('unhandledRejection', (err: Error) => {
    logger.error(err);
});

process.on('SIGINT', async () => {
    await bot.database.close();
    logger.info('Process terminated');
    process.exit(0);
});

process.on('uncaughtException', (err) => {
    logger.criticalError(err.stack);
});