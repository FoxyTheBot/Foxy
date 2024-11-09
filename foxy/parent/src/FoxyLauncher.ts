import { logger } from '../../../common/utils/logger';
import FoxyInstance from './FoxyInstance';
import { FoxyClient } from './structures/types/FoxyClient';
import TopggStatsSender from './utils/analytics/TopggStatsSender';

require('dotenv').config({ path: '../../.env' });

function main() {
    const botInstance = new FoxyInstance();
    const bot = botInstance.bot;

    setupTopggStatsSender(bot);
    setupUnhandledRejectionHandler();
    setupSignalHandlers(botInstance);

    return bot;
}

async function setupTopggStatsSender(bot: FoxyClient) {
    new TopggStatsSender(process.env.DBL_TOKEN).createPostStatsRoutine(bot);
}

function setupUnhandledRejectionHandler() {
    process.on('unhandledRejection', (err: Error) => {
        logger.error(err);
    });

    process.on('uncaughtException', (err) => {
        logger.criticalError(err.stack);
    });
}

function setupSignalHandlers(botInstance: FoxyInstance) {
    process.on('SIGINT', async () => {
        await shutdown(botInstance);
    });

    process.on('SIGTERM', async () => {
        await shutdown(botInstance);
    });
}

async function shutdown(botInstance: FoxyInstance) {
    await botInstance.shutdown();
    logger.info('Process terminated');
    process.exit(0);
}

const bot = main();
export { bot };