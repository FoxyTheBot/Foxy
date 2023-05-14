import ChatInputMessageContext from '../../structures/commands/ChatInputMessageContext';
import { FoxyClient } from '../../structures/types/foxy';
import { logger } from '../logger';

export default class InviteBlockerModule {
    public bot: FoxyClient;
    constructor(bot) {
        this.bot = bot;
    }

    async start() {
        logger.info("[MODULES] Started Invite Blocker Module!")
        const inviteRegex = /discord(?:app\.com\/invite|\.gg(?:\/invite)?)\/([\w-]{2,255})/i;
        this.bot.events.messageCreate = async (_, message) => {
            const guildId = message.guildId;
            const guildInfo = await this.bot.database.getGuild(guildId);
            if (await guildInfo.InviteBlockerModule.isEnabled) {
                if (!this.bot.hasGuildPermission(this.bot, guildId, ["MANAGE_MESSAGES"] || ["ADMINISTRATOR"])) return;
                if (message.authorId === this.bot.applicationId || message.isFromBot || message.webhookId) return;
                const context = new ChatInputMessageContext(message);
                const authorRoles = await message.member.roles.map(role => role ? role.toString().replace("n", "") : null);

                var blockMessage: string = await guildInfo.InviteBlockerModule.blockMessage ?? `Você não pode enviar convites aqui!`;
                if (message.content === blockMessage && message.authorId === this.bot.applicationId) {
                    setTimeout(async () => {
                        context.DeleteMessage(message.id, "Invite Blocker - Delete alert message");
                    }, 2000);
                }

                if (!inviteRegex.test(message.content)) return;
                if (authorRoles.find(role => guildInfo.InviteBlockerModule.whitelistedRoles.includes(role))) return;
                if (await guildInfo.InviteBlockerModule.whitelistedChannels.includes(message.channelId)) return;
                if (await guildInfo.InviteBlockerModule.whitelistedUsers.includes(message.authorId)) return;


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
        }

        this.bot.events.messageUpdate = async (_, message) => {
            const guildId = message.guildId;
            const guildInfo = await this.bot.database.getGuild(guildId);
            if (await guildInfo.InviteBlockerModule.isEnabled) {
                if (!this.bot.hasGuildPermission(this.bot, guildId, ["MANAGE_MESSAGES"] || ["ADMINISTRATOR"])) return;
                if (message.authorId === this.bot.applicationId || message.isFromBot || message.webhookId) return;
                const context = new ChatInputMessageContext(message);
                const authorRoles = await message.member.roles.map(role => role ? role.toString().replace("n", "") : null);

                var blockMessage: string = guildInfo.InviteBlockerModule.blockMessage ?? `Você não pode enviar convites aqui!`;
                if (message.content === blockMessage && message.authorId === this.bot.applicationId) {
                    setTimeout(async () => {
                        context.DeleteMessage(await message.id, "Invite Blocker");
                    }, 2000);
                }
                if (await !guildInfo.InviteBlockerModule.isEnabled) return;
                if (message.authorId === this.bot.applicationId || message.isFromBot) return;
                if (!inviteRegex.test(message.content)) return;
                if (authorRoles.find(role => guildInfo.InviteBlockerModule.whitelistedRoles.includes(role))) return;
                if (await guildInfo.InviteBlockerModule.whitelistedChannels.includes(message.channelId)) return;
                if (await guildInfo.InviteBlockerModule.whitelistedUsers.includes(message.authorId)) return;

                if (blockMessage.includes("{user}")) {
                    blockMessage = blockMessage.replace("{user}", `<@${message.authorId}>`);
                }
                if (blockMessage.includes("{channel}")) {
                    blockMessage = blockMessage.replace("{channel}", `<#${message.channelId}>`);
                }

                if (inviteRegex.test(message.content) && !authorRoles.find(role => guildInfo.InviteBlockerModule.whitelistedRoles.includes(role)) || !authorRoles) {
                    setTimeout(async () => {
                        context.DeleteMessage(await message.id, "Invite Blocker");
                        context.FoxyReply({
                            content: blockMessage
                        })
                    }, 500);
                }
            }
        }
    }
}