import { createBot, Collection, GatewayIntents } from 'discordeno';
import { BotWithCache, BotWithHelpersPlugin, enableHelpersPlugin } from 'discordeno/plugins';
import { Command } from './structures/types/Command';
import { FoxyClient } from './structures/types/foxy';
import setupClient from './structures/client/foxyClient';
import config from '../config.json';
const EventManager = require("./structures/EventManager");
const events = new EventManager({});

const bot = createBot({
    events: events.load({}),
    token: config.token,
    intents: GatewayIntents.Guilds | GatewayIntents.GuildMessages | GatewayIntents.GuildMessageReactions | GatewayIntents.GuildMembers,
});

enableHelpersPlugin(bot);


export interface BotClient extends BotWithCache<BotWithHelpersPlugin> {
    commands: Collection<string, Command>;
}
export default bot as FoxyClient;
setupClient(bot, {
    localesPath: __dirname + "/locales"
});