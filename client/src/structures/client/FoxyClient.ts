import { Bot, handleInteractionCreate, Collection } from 'discordeno';
import config from '../../../config.json';
import { FoxyClient } from '../types/foxy';
import { loadCommands } from '../commands/loadCommands';
import DatabaseConnection from '../database/DatabaseConnection';
import { transformInteraction } from '../internals/transformers/interactionResponse';

const setupFoxy = (client: FoxyClient): void => {
    client.ownerId = BigInt(config.ownerId);
    client.clientId = BigInt(config.clientId);
    client.commands = new Collection();
    client.isProduction = config.productionEnv;
    client.database = new DatabaseConnection(client);
    client.emotes = require("../json/emotes.json");
    loadCommands();
}

const setupInternals = async (bot: Bot): Promise<void> => {
    bot.transformers.reverse.interactionResponse = transformInteraction;
    bot.handlers.INTERACTION_CREATE = handleInteractionCreate;  
};

export { setupFoxy, setupInternals };