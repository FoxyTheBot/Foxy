import { handleInteractionCreate, Collection, DiscordUnavailableGuild } from 'discordeno';
import { FoxyClient } from '../types/foxy';
import { loadCommands } from '../commands/loadCommands';
import { transformInteraction } from '../internals/transformers/interactionResponse';
import { loadLocales } from '../../utils/localeLoader';
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
    client.gateway.manager.createShardOptions.events.message = async (shard, message) => {
        if (message.t === 'GUILD_DELETE' && (message.d as DiscordUnavailableGuild).unavailable) return;
        if (message.t === 'GUILD_AUDIT_LOG_ENTRY_CREATE') return;
        
        client.handlers[message.t]?.(client, message, shard.id);
    };
    loadCommands();
    loadLocales();
    startActivities();
}

const startCacheHandler = async (client: FoxyClient): Promise<void> => {
    bot.presences.maxSize = 0;
    bot.guilds.maxSize = 1000;
    bot.channels.maxSize = 1000;
    bot.messages.maxSize = 100
    bot.users.maxSize = 1000;
    
    setInterval(() => {
        client.dispatchedGuildIds.clear();
        client.dispatchedChannelIds.clear();
    }, 3600000);
};

const setupInternals = async (bot: FoxyClient): Promise<void> => {
    bot.transformers.reverse.interactionResponse = transformInteraction;
    bot.handlers.INTERACTION_CREATE = handleInteractionCreate;
};

export { setupFoxy, setupInternals, startCacheHandler };