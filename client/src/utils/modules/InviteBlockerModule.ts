import { BotWithCache } from 'discordeno/cache-plugin';
import ChatInputMessageContext from '../../structures/commands/ChatInputMessageContext';
import { FoxyClient } from '../../structures/types/foxy';

export default class InviteBlockerModule {
    public bot: FoxyClient;
    constructor(bot) {
        this.bot = bot;
    }

    async start() {
        const inviteRegex = /discord(?:app\.com\/invite|\.gg(?:\/invite)?)\/([\w-]{2,255})/i;
        this.bot.events.messageCreate = async (_, message) => {
            const guildId = message.guildId;
            const guildInfo = await this.bot.database.getGuild(guildId);
            const context = new ChatInputMessageContext(message);
            const authorRoles = context.authorRoles.map(role => role.toString().replace("n", ""));

            if (message.authorId === this.bot.applicationId || message.isFromBot) return;
            if (!inviteRegex.test(message.content)) return;
            if (authorRoles.find(role => guildInfo.InviteBlockerModule.whitelistedRoles.includes(role))) return;
            if (!guildInfo.InviteBlockerModule.isEnabled) return;
            if (await guildInfo.InviteBlockerModule.whitelistedChannels.includes(message.channelId)) return;
            if (!this.bot.hasGuildPermission(this.bot as BotWithCache<FoxyClient>, guildId, ["MANAGE_MESSAGES"] || ["ADMINISTRATOR"])) return;
            var blockMessage = guildInfo.InviteBlockerModule.blockMessage ?? `Você não pode enviar convites aqui!`;
            if (blockMessage.includes("{user}")) {
                blockMessage = blockMessage.replace("{user}", `<@${message.authorId}>`);
            } 
            if (blockMessage.includes("{channel}")) {
                blockMessage = blockMessage.replace("{channel}", `<#${message.channelId}>`);
            }
            if (inviteRegex.test(message.content) && !authorRoles.find(role => guildInfo.InviteBlockerModule.whitelistedRoles.includes(role))) {
                context.DeleteMessage(message.id, "Invite Blocker");
                context.FoxyReply({
                    content: blockMessage
                });
            }
        }

        this.bot.events.messageUpdate = async (_, message) => {
            const guildId = message.guildId;
            const guildInfo = await this.bot.database.getGuild(guildId);
            const context = new ChatInputMessageContext(message);
            const authorRoles = context.authorRoles.map(role => role.toString().replace("n", ""));
            
            if (message.authorId === this.bot.applicationId || message.isFromBot) return;
            if (!inviteRegex.test(message.content)) return;
            if (authorRoles.find(role => guildInfo.InviteBlockerModule.whitelistedRoles.includes(role))) return;
            if (!guildInfo.InviteBlockerModule.isEnabled) return;
            if (await guildInfo.InviteBlockerModule.whitelistedChannels.includes(message.channelId)) return;

            var blockMessage = guildInfo.InviteBlockerModule.blockMessage ?? `Você não pode enviar convites aqui!`;
            
            if (blockMessage.includes("{user}")) {
                blockMessage = blockMessage.replace("{user}", `<@${message.authorId}>`);
            } 
            if (blockMessage.includes("{channel}")) {
                blockMessage = blockMessage.replace("{channel}", `<#${message.channelId}>`);
            }

            if (inviteRegex.test(message.content) && !authorRoles.find(role => guildInfo.InviteBlockerModule.whitelistedRoles.includes(role))) {
                context.DeleteMessage(message.id, "Invite Blocker");
                context.FoxyReply({
                    content: blockMessage
                });
            }
        }
    }
}