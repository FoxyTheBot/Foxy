import { createBot, Intents, startBot } from 'discordeno';
import { setupFoxy, setupInternals } from './structures/client/FoxyClient';
import { FoxyClient } from './structures/types/foxy';
import { loadLocales } from './utils/loader';
import { EventManager } from './structures/events/EventManager';
import { logger } from './utils/logger';
import config from '../config.json';

const events = new EventManager({});

const bot = createBot({
    token: config.token,
    events: events.load({}),
    intents: Intents.Guilds,
    botId: BigInt(config.clientId),
    applicationId: BigInt(config.clientId),
}) as FoxyClient;

setupFoxy(bot);
setupInternals(bot);
loadLocales(__dirname + '/locales');

startBot(bot);
export { bot };

process.on('unhandledRejection', (err) => {
    logger.error(err);
});

process.on('uncaughtException', (err) => {
    logger.criticalError(err.stack);
    process.exit(1);
});