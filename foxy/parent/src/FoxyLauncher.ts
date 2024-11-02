import { logger } from '../../../common/utils/logger';
import FoxyInstance from './FoxyInstance';
require('dotenv').config({ path: '../../.env' });

const bot = new FoxyInstance().bot;
export { bot };

process.on('unhandledRejection', (err: Error) => {
    logger.error(err);
});

process.on('uncaughtException', (err) => {
    logger.criticalError(err.stack);
});