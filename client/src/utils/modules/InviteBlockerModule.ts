import { BotWithCache } from 'discordeno/cache-plugin';
import ChatInputMessageContext from '../../structures/commands/ChatInputMessageContext';
import { FoxyClient } from '../../structures/types/foxy';
import { logger } from '../logger';

export default class InviteBlockerModule {
    public bot: FoxyClient;
    constructor(bot) {
        this.bot = bot;
    }

    async start() {
        logger.info("[MODULES] Invite Blocker started!")
        const inviteRegex = /discord(?:app\.com\/invite|\.gg(?:\/invite)?)\/([\w-]{2,255})/i;
        this.bot.events.messageCreate = async (_, message) => {
            const guildId = message.guildId;
            const guildInfo = await this.bot.database.getGuild(guildId);
            const context = new ChatInputMessageContext(message);
            const authorRoles = await context.authorRoles.map(role => {
                if (role) {
                    return role.toString().replace("n", "");
                } else {
                    return null;
                }
            });
            var blockMessage = guildInfo.InviteBlockerModule.blockMessage ?? `Você não pode enviar convites aqui!`;
            if (message.content === blockMessage && message.authorId === this.bot.applicationId) {
                setTimeout(async () => {
                    context.DeleteMessage(message.id, "Invite Blocker");
                }, 2000);
            }
            if (message.authorId === this.bot.applicationId || message.isFromBot,
                (!inviteRegex.test(message.content)),
                (authorRoles.find(role => guildInfo.InviteBlockerModule.whitelistedRoles.includes(role))),
                (!guildInfo.InviteBlockerModule.isEnabled),
                (await guildInfo.InviteBlockerModule.whitelistedChannels.includes(message.channelId)),
                (!this.bot.hasGuildPermission(this.bot as BotWithCache<FoxyClient>, guildId, ["MANAGE_MESSAGES"] || ["ADMINISTRATOR"])),
                (await guildInfo.InviteBlockerModule.whitelistedUsers.includes(message.authorId))) return;


            if (blockMessage.includes("{user}")) {
                blockMessage = blockMessage.replace("{user}", `<@${message.authorId}>`);
            }
            if (blockMessage.includes("{channel}")) {
                blockMessage = blockMessage.replace("{channel}", `<#${message.channelId}>`);
            }
            if (inviteRegex.test(message.content) && !authorRoles.find(role => guildInfo.InviteBlockerModule.whitelistedRoles.includes(role)) || !authorRoles) {
                setTimeout(async () => {
                    context.DeleteMessage(message.id, "Invite Blocker");
                    context.FoxyReply({
                        content: blockMessage
                    });
                }, 500);
            }
        }

        this.bot.events.messageUpdate = async (_, message) => {
            const guildId = message.guildId;
            const guildInfo = await this.bot.database.getGuild(guildId);
            const context = new ChatInputMessageContext(message);
            const authorRoles = await context.authorRoles.map(role => {
                if (role) {
                    return role.toString().replace("n", "");
                } else {
                    return null;
                }
            });
            var blockMessage = guildInfo.InviteBlockerModule.blockMessage ?? `Você não pode enviar convites aqui!`;
            if (message.content === blockMessage && message.authorId === this.bot.applicationId) {
                setTimeout(async () => {
                    context.DeleteMessage(message.id, "Invite Blocker");
                }, 2000);
            }
            if (message.authorId === this.bot.applicationId || message.isFromBot,
                (!inviteRegex.test(message.content)),
                (authorRoles.find(role => guildInfo.InviteBlockerModule.whitelistedRoles.includes(role))),
                (!guildInfo.InviteBlockerModule.isEnabled),
                (await guildInfo.InviteBlockerModule.whitelistedChannels.includes(message.channelId)),
                (!this.bot.hasGuildPermission(this.bot as BotWithCache<FoxyClient>, guildId, ["MANAGE_MESSAGES"] || ["ADMINISTRATOR"])),
                (await guildInfo.InviteBlockerModule.whitelistedUsers.includes(message.authorId))) return;

            if (blockMessage.includes("{user}")) {
                blockMessage = blockMessage.replace("{user}", `<@${message.authorId}>`);
            }
            if (blockMessage.includes("{channel}")) {
                blockMessage = blockMessage.replace("{channel}", `<#${message.channelId}>`);
            }

            if (inviteRegex.test(message.content) && !authorRoles.find(role => guildInfo.InviteBlockerModule.whitelistedRoles.includes(role)) || !authorRoles) {
                setTimeout(async () => {
                    context.DeleteMessage(message.id, "Invite Blocker");
                    context.FoxyReply({
                        content: blockMessage
                    })
                }, 500);
            }
        }
    }
}