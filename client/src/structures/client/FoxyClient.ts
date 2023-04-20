import { Bot, handleInteractionCreate, Collection } from 'discordeno';
import config from '../../../config.json';
import { FoxyClient } from '../types/foxy';
import { loadCommands } from '../commands/loadCommands';
import DatabaseConnection from '../database/DatabaseConnection';
import { transformInteraction } from '../internals/transformers/interactionResponse';
import { loadLocales } from '../../utils/loader';
import { bot } from '../..';

const setupFoxy = async (client: FoxyClient): Promise<void> => {
    client.owner = await bot.helpers.getUser(config.ownerId);
    client.clientId = BigInt(config.clientId);
    client.commands = new Collection();
    client.isProduction = config.productionEnv;
    client.database = new DatabaseConnection(client);
    client.emotes = require("../json/emotes.json");
    client.isReady = false;
    loadCommands();
    loadLocales();
}

const setupInternals = async (bot: Bot): Promise<void> => {
    bot.transformers.reverse.interactionResponse = transformInteraction;
    bot.handlers.INTERACTION_CREATE = handleInteractionCreate;
};

export { setupFoxy, setupInternals };