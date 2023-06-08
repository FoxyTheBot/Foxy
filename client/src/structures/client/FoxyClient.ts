import { handleInteractionCreate, Collection } from 'discordeno';
import { FoxyClient } from '../types/foxy';
import { loadCommands } from '../commands/loadCommands';
import { transformInteraction } from '../internals/transformers/interactionResponse';
import { loadLocales } from '../../utils/loader';
import { bot } from '../..';
import { botHasGuildPermissions } from 'discordeno/permissions-plugin';
import DatabaseConnection from '../database/DatabaseConnection';
import config from '../../../config.json';
import { startActivities } from '../../utils/Activities';
import { FoxyRestManager } from '../../utils/RestManager';

const setupFoxy = async (client: FoxyClient): Promise<void> => {
    client.owner = await bot.helpers.getUser(config.ownerId);
    client.clientId = BigInt(config.clientId);
    client.commands = new Collection();
    client.isProduction = config.productionEnv;
    client.database = new DatabaseConnection(client);
    client.emotes = require("../json/emotes.json");
    client.isReady = false;
    client.hasGuildPermission = botHasGuildPermissions;
    client.foxyRest = new FoxyRestManager(client);
    loadCommands();
    loadLocales();
    startActivities();
}

const setupInternals = async (bot: FoxyClient): Promise<void> => {
    bot.transformers.reverse.interactionResponse = transformInteraction;
    bot.handlers.INTERACTION_CREATE = handleInteractionCreate;
};

export { setupFoxy, setupInternals };