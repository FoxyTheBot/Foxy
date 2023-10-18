import { createBot, Intents, startBot } from 'discordeno';
import { setupFoxy, setupInternals, startCacheHandler } from './structures/client/FoxyClient';
import { FoxyClient } from './structures/types/foxy';
import { logger } from './utils/logger';
import config from '../config.json';
import { enableCachePlugin } from 'discordeno/cache-plugin'
import { setupEventsHandler } from './events';

const bot = createBot({
    token: config.token,
    intents: 3183191 as Intents,
    botId: BigInt(config.clientId),
    applicationId: BigInt(config.clientId)
}) as FoxyClient;

enableCachePlugin(bot);
setupFoxy(bot);
startCacheHandler(bot);
setupInternals(bot);
setupEventsHandler();
startBot(bot);

export { bot };

process.on('unhandledRejection', (err: Error) => {
    return logger.error(err);
});

process.on('uncaughtException', (err) => {
    logger.criticalError(err.stack);
});