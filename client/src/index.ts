import { createBot, Intents, startBot } from 'discordeno';
import { setupFoxy, setupInternals, startModules } from './structures/client/FoxyClient';
import { FoxyClient } from './structures/types/foxy';
import { EventManager } from './structures/events/EventManager';
import { logger } from './utils/logger';
import config from '../config.json';

const events = new EventManager({});

const bot = createBot({
    token: config.token,
    events: events.load({}),
    intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent | Intents.GuildMembers,
    botId: BigInt(config.clientId),
    applicationId: BigInt(config.clientId),
}) as FoxyClient;

setupFoxy(bot);
setupInternals(bot);
startModules(bot);
startBot(bot);

export { bot };

process.on('unhandledRejection', (err) => {
    logger.error(err);
});

process.on('uncaughtException', (err) => {
    logger.criticalError(err.stack);
});