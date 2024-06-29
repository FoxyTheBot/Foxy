import { handleInteractionCreate, Collection, DiscordUnavailableGuild, createBot, Intents, startBot } from 'discordeno';
import { FoxyClient } from '../types/foxy';
import { loadCommands } from '../../command/structures/loadCommands';
import { transformInteraction } from '../internals/transformers/interactionResponse';
import { loadLocales } from '../../utils/localeLoader';
import { botHasGuildPermissions } from 'discordeno/permissions-plugin';
import { setReadyEvent } from "../../listeners/ready";
import DatabaseConnection from '../database/DatabaseConnection';
import { setInteractionCreateEvent } from '../../listeners/interactionCreate';
import { setGuildCreateEvent } from '../../listeners/guildCreate';
import { setGuildDeleteEvent } from '../../listeners/guildDelete';
import { setMessageCreateEvent } from '../../listeners/messageCreate';
import config from '../../../config.json';
import express, { Application } from 'express';
import { logger } from '../../utils/logger';
import enableCachePlugin from 'discordeno/cache-plugin';
import { colors } from '../../utils/colors';
import { FoxyRestManager } from '../../utils/RestManager';
import { emotes } from '../../utils/emotes';

export default class FoxyInstance {
    public bot: FoxyClient;
    private server: Application;
    constructor() {
        this.startInstance();
    }

    private async startInstance(): Promise<FoxyClient> {
        this.bot = this.createBotInstance();
        enableCachePlugin(this.bot);
        await this.setupDefinitions();
        await this.setupEventsHandler();
        await this.setupInternals();
        await this.setupServer();
        await this.setupCache();
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
        this.bot.emotes = emotes;
        this.bot.colors = colors;
        this.bot.clientId = BigInt(config.clientId);
        this.bot.hasGuildPermission = botHasGuildPermissions;
        this.bot.database = new DatabaseConnection(this.bot);
        this.bot.rest.foxy = new FoxyRestManager(this.bot);
    }

    private async setupCache() {
        this.bot.dispatchedGuildIds = new Set();
        this.bot.presences.maxSize = 1;
        this.bot.guilds.maxSize = 1000;
        this.bot.members.maxSize = 1000;
        this.bot.channels.maxSize = 1000;
        this.bot.messages.maxSize = 100;
        this.bot.users.maxSize = 1000;

        setInterval(() => {
            this.bot.dispatchedGuildIds.clear();
            this.bot.dispatchedChannelIds.clear();
            this.bot.messages.clear();
            this.bot.channels.clear();
        }, 3600000);
    }

    private async setupInternals() {
        await loadCommands();
        await loadLocales();
        this.bot.transformers.reverse.interactionResponse = transformInteraction;
        this.bot.handlers.INTEGRATION_CREATE = handleInteractionCreate;
    }

    private async setupServer() {
        this.server = express();
        this.server.use(express.json());
        this.server.listen(3001, () => {
            logger.info(`[SERVER] Server is running on port 3001`)
        });

        this.server.post("/status/update", async (req, res) => {
            const { name, type, status, url } = req.body;

            this.bot.helpers.editBotStatus({
                activities: [{
                    name: name,
                    type: type,
                    url: url,
                    createdAt: Date.now()
                }],
                status: status
            })
            return res.status(200).json({ success: true });
        });
    }

    private async setupEventsHandler() {
        setReadyEvent();
        setInteractionCreateEvent();
        setGuildCreateEvent();
        setGuildDeleteEvent();
        setMessageCreateEvent();
        this.bot.gateway.manager.createShardOptions.events.message = async (shard, message) => {
            /* Handle unavailable guilds because discordeno does not handle unavailable guilds by default
            *  Reference: https://discordeno.js.org/api_reference/generated/interfaces/EventHandlers?_highlight=guilddelete#guilddelete
            */
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