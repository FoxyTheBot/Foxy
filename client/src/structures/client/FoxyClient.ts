import { Bot, handleInteractionCreate, Collection, handleMessageCreate, handleGuildMemberAdd } from 'discordeno';
import config from '../../../config.json';
import { FoxyClient } from '../types/foxy';
import { loadCommands } from '../commands/loadCommands';
import DatabaseConnection from '../database/DatabaseConnection';
import { transformInteraction } from '../internals/transformers/interactionResponse';
import { loadLocales } from '../../utils/loader';
import { bot } from '../..';
import AutoRoleModule from '../../utils/modules/AutoRoleModule';
import InviteBlockerModule from '../../utils/modules/InviteBlockerModule';
import { botHasGuildPermissions } from 'discordeno/permissions-plugin';

const setupFoxy = async (client: FoxyClient): Promise<void> => {
    client.owner = await bot.helpers.getUser(config.ownerId);
    client.clientId = BigInt(config.clientId);
    client.commands = new Collection();
    client.isProduction = config.productionEnv;
    client.database = new DatabaseConnection(client);
    client.emotes = require("../json/emotes.json");
    client.isReady = false;
    client.hasGuildPermission = botHasGuildPermissions;
    loadCommands();
    loadLocales();
}

const setupInternals = async (bot: Bot): Promise<void> => {
    bot.transformers.reverse.interactionResponse = transformInteraction;
    bot.handlers.INTERACTION_CREATE = handleInteractionCreate;
    bot.handlers.MESSAGE_CREATE = handleMessageCreate;
    bot.handlers.MESSAGE_UPDATE = handleMessageCreate;
    bot.handlers.GUILD_MEMBER_ADD = handleGuildMemberAdd;
};

const startModules = async (bot: Bot): Promise<void> => {
    new AutoRoleModule(bot).start();
    new InviteBlockerModule(bot).start();
}

export { setupFoxy, setupInternals, startModules };