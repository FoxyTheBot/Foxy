import { handleInteractionCreate, Collection, DiscordUnavailableGuild, createBot, Intents, startBot } from 'discordeno';
import { FoxyClient } from '../types/foxy';
import { loadCommands } from '../../command/structures/loadCommands';
import { transformInteraction } from '../internals/transformers/interactionResponse';
import { loadLocales } from '../../utils/localeLoader';
import { botHasGuildPermissions } from 'discordeno/permissions-plugin';
import { FoxyRestManager } from '../../utils/RestManager';
import { setReadyEvent } from "../../listeners/ready";
import DatabaseConnection from '../database/DatabaseConnection';
import { setInteractionCreateEvent } from '../../listeners/interactionCreate';
import { setGuildCreateEvent } from '../../listeners/guildCreate';
import { setGuildDeleteEvent } from '../../listeners/guildDelete';
import { setMessageCreateEvent } from '../../listeners/messageCreate';
import config from '../../../config.json';

export default class FoxyInstance {
    public bot: FoxyClient;
    constructor() {
        this.startInstance();
    }

    public async startInstance(): Promise<FoxyClient> {
        this.bot = this.createBotInstance();
        await this.setupDefinitions();
        await this.setupEventsHandler();
        await this.setupInternals();
        await startBot(this.bot);
        return this.bot;
    }

    private createBotInstance() {
        return createBot({
            token: config.token,
            intents: 37379 as Intents,
            botId: BigInt(config.clientId),
        }) as FoxyClient;
    }

    private async setupDefinitions() {
        this.bot.commands = new Collection();
        this.bot.isProduction = config.productionEnv;
        this.bot.emotes = require('../json/emotes.json');
        this.bot.clientId = BigInt(config.clientId);
        this.bot.hasGuildPermission = botHasGuildPermissions;
        this.bot.database = new DatabaseConnection(this.bot);
        this.bot.foxyRest = new FoxyRestManager(this.bot);
    }

    private async setupInternals() {
        await loadCommands();
        await loadLocales();
        this.bot.transformers.reverse.interactionResponse = transformInteraction;
        this.bot.handlers.INTEGRATION_CREATE = handleInteractionCreate;
    }

    private async setupEventsHandler() {
        setReadyEvent();
        setInteractionCreateEvent();
        setGuildCreateEvent();
        setGuildDeleteEvent();
        setMessageCreateEvent();

        this.bot.gateway.manager.createShardOptions.events.message = async (shard, message) => {
            // Handle unavailable guilds
            if (message.t === 'GUILD_DELETE' && (message.d as DiscordUnavailableGuild).unavailable) {
                return this.handleUnavailableGuild(message);
            }

            // Block audit log entries
            if (message.t === 'GUILD_AUDIT_LOG_ENTRY_CREATE') return;

            this.bot.handlers[message.t]?.(this.bot, message, shard.id);
        }
    }

    private async handleUnavailableGuild(message: any) {
        return this.bot.helpers.sendWebhookMessage(config.webhooks.join_leave_guild.id, config.webhooks.join_leave_guild.token, {
            embeds: [{
                title: `<:emoji:${this.bot.emotes.FOXY_CRY}> **|** Servidor indisponivel!`,
                description: `**ID:** ${(message.d as DiscordUnavailableGuild).id}`
            }]
        });
    }
}