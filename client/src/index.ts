import { createBot, Intents, startBot } from 'discordeno';
import config from '../config.json';
import { setupFoxy, setupInternals } from './structures/client/FoxyClient';
import { FoxyClient } from './structures/types/foxy';
import { loadLocales } from './utils/loader';
const EventManager = require("./structures/events/EventManager");
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

// @ts-expect-error nhaww
bot.events.ready();
startBot(bot);
export { bot };
