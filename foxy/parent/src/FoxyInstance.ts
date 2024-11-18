import { handleInteractionCreate, Collection, DiscordUnavailableGuild, createBot, Intents, startBot } from 'discordeno';
import { FoxyClient } from './structures/types/FoxyClient';
import { loadCommands } from './command/structures/loadCommands';
import { transformInteraction } from './structures/internals/transformers/interactionResponse';
import { loadLocales } from './utils/localeLoader';
import { botHasGuildPermissions } from 'discordeno/permissions-plugin';
import { setReadyEvent } from "./listeners/ready";
import DatabaseConnection from '../../../common/utils/database/DatabaseConnection';
import { setInteractionCreateEvent } from './listeners/interactionCreate';
import { setGuildCreateEvent } from './listeners/guildCreate';
import { setGuildDeleteEvent } from './listeners/guildDelete';
import { setMessageCreateEvent } from './listeners/messageCreate';
import express, { Application } from 'express';
import { logger } from '../../../common/utils/logger';
import enableCachePlugin from 'discordeno/cache-plugin';
import { colors } from '../../../common/utils/colors';
import { FoxyRestManager } from '../../../common/utils/RestManager';
import { emotes } from '../../../common/utils/emotes';
import setGuildMemberRemoveEvent from './listeners/guildMemberRemove';
import ImageGenerator from './utils/images/ImageGenerator';
import { onShardConnect } from './listeners/gateway/onShardConnect';
import { onShardDisconnect } from './listeners/gateway/onShardDisconnect';
import DebugUtils from './test/DebugUtils';
import setGuildMemberAddEvent from './listeners/guildMemberAdd';

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
        await this.setupCommandsAndLocales();
        await startBot(this.bot);
        return this.bot;
    }

    private createBotInstance() {
        const bot = createBot({
            token: process.env.DISCORD_TOKEN,
            intents: Intents.Guilds | Intents.GuildMessages | Intents.GuildMembers | Intents.MessageContent,
            botId: BigInt(process.env.CLIENT_ID),
            events: {
                guildCreate: (_, guild) => setGuildCreateEvent(_, guild),
                guildDelete: (_, guild) => setGuildDeleteEvent(_, guild),
                interactionCreate: (_, interaction) => setInteractionCreateEvent(_, interaction),
                guildMemberAdd: (_, member, user) => setGuildMemberAddEvent(_, member, user),
                guildMemberRemove: (_, member, guildId) => setGuildMemberRemoveEvent(_, member, guildId),
                messageCreate: (_, message) => setMessageCreateEvent(_, message),
                ready: (_, payload) => setReadyEvent(_, payload)
            },
            botGatewayData: {
                sessionStartLimit: {
                    total: 100,
                    remaining: 100,
                    resetAfter: 1000 * 60, // 1 minute
                    maxConcurrency: process.env.MAX_CONCURRENCY ? Number(process.env.MAX_CONCURRENCY) : 1
                },
                shards: Number(process.env.SHARD_COUNT) || 1,
                url: process.env.DISCORD_GATEWAY_URL
            },
        }) as FoxyClient;

        bot.gateway.manager.createShardOptions.rateLimitResetInterval = 60000;
        bot.gateway.manager.createShardOptions.maxRequestsPerRateLimitTick = 5;
        bot.gateway.spawnShardDelay = process.env.SHARD_SPAWN_DELAY ? Number(process.env.SHARD_SPAWN_DELAY) : 5000;
        return bot;
    }

    private async setupDefinitions() {
        this.bot.commands = new Collection();
        this.bot.isProduction = !process.argv.includes("--dev");
        this.bot.emotes = emotes;
        this.bot.colors = colors;
        this.bot.clientId = BigInt(process.env.CLIENT_ID);
        this.bot.hasGuildPermission = botHasGuildPermissions;
        this.bot.database = new DatabaseConnection(this.bot);
        this.bot.rest.foxy = new FoxyRestManager();
        this.bot.generators = new ImageGenerator();
    }

    private async setupCache() {
        this.bot.presences.maxSize = 0;
        this.bot.guilds.maxSize = 100;
        this.bot.members.maxSize = 100;
        this.bot.channels.maxSize = 0;
        this.bot.messages.maxSize = 100;
        this.bot.users.maxSize = 1000;

        setInterval(() => {
            this.bot.dispatchedGuildIds.clear();
            this.bot.dispatchedChannelIds.clear();
            this.bot.messages.clear();
            this.bot.cache.fetchAllMembersProcessingRequests.clear();
            this.bot.cache.unrepliedInteractions.clear();
        }, 600000);
    }

    private async setupInternals() {
        this.bot.transformers.reverse.interactionResponse = transformInteraction;
        this.bot.handlers.INTEGRATION_CREATE = handleInteractionCreate;
        if (!this.bot.isProduction || process.argv.includes("--debug")) {
            new DebugUtils(this.bot);
        }
    }

    private async setupCommandsAndLocales() {
        await loadCommands();
        await loadLocales();
    }

    private async setupServer() {
        this.server = express();
        this.server.use(express.json());
        this.server.listen(process.env.FOXY_STATUS_PORT, () => {
            logger.info(`[SERVER] Foxy Status Server is running on port ${process.env.FOXY_STATUS_PORT}`);
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

    public async shutdown() {
        await this.bot.gateway.manager.shards.forEach((shard) => {
            logger.info(`[SHARD] Shard ${shard.id} is disconnecting...`);
            shard.shutdown();
        });
        this.bot.database.close();

        this.bot.dispatchedGuildIds.clear();
        this.bot.dispatchedChannelIds.clear();
        this.bot.messages.clear();
        this.bot.cache.fetchAllMembersProcessingRequests.clear();
        this.bot.cache.unrepliedInteractions.clear();
        this.bot.channels.clear();
        this.bot.presences.clear();
        this.bot.guilds.clear();
        this.bot.members.clear();
    }

    private async setupEventsHandler() {
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

        onShardConnect();
        onShardDisconnect();
    }

    private async handleUnavailableGuild(message: any) {
        return this.bot.helpers.sendWebhookMessage(process.env.JOIN_GUILD_WEBHOOK_ID, process.env.JOIN_GUILD_WEBHOOK_TOKEN, {
            embeds: [{
                title: `<:emoji:${this.bot.emotes.FOXY_CRY}> **|** Servidor indisponivel!`,
                description: `**ID:** ${(message.d as DiscordUnavailableGuild).id}`
            }]
        });
    }
}