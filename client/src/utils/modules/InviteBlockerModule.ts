import { Message } from 'discordeno/transformers';
import ChatInputMessageContext from '../../structures/commands/ChatInputMessageContext';
import { FoxyClient } from '../../structures/types/foxy';

const unicodeLookalikes = {
    "a": [
        "\u0430",
        "\u00e0",
        "\u00e1",
        "\u1ea1",
        "\u0105"
    ],
    "c": [
        "\u0441",
        "\u0188",
        "\u010b"
    ],
    "d": [
        "\u0501",
        "\u0257"
    ],
    "e": [
        "\u0435",
        "\u1eb9",
        "\u0117",
        "\u00e9",
        "\u00e8"
    ],
    "g": [
        "\u0121"
    ],
    "h": [
        "\u04bb"
    ],
    "i": [
        "\u0456",
        "\u00ed",
        "\u00ec",
        "\u00ef"
    ],
    "j": [
        "\u0458",
        "\u029d"
    ],
    "k": [
        "\u03ba"
    ],
    "l": [
        "\u04cf",
        "\u1e37"
    ],
    "n": [
        "\u0578"
    ],
    "o": [
        "\u043e",
        "\u03bf",
        "\u0585",
        "\u022f",
        "\u1ecd",
        "\u1ecf",
        "\u01a1",
        "\u00f6",
        "\u00f3",
        "\u00f2"
    ],
    "p": [
        "\u0440"
    ],
    "q": [
        "\u0566"
    ],
    "s": [
        "\u0282"
    ],
    "u": [
        "\u03c5",
        "\u057d",
        "\u00fc",
        "\u00fa",
        "\u00f9"
    ],
    "v": [
        "\u03bd",
        "\u0475"
    ],
    "x": [
        "\u0445",
        "\u04b3"
    ],
    "y": [
        "\u0443",
        "\u00fd"
    ],
    "z": [
        "\u0290",
        "\u017c"
    ]
};

const unicodeLookalikePattern = Object.values(unicodeLookalikes)
    .flat()
    .map(char => char.replace("\\", "\\\\"))
    .join('');

const inviteRegex = new RegExp(`discord(?:app\\.com\\/invite|\\.gg(?:\\/invite)?)\\/([\\w-${unicodeLookalikePattern}]{2,255})`, 'i');


export default class InviteBlockerModule {
    public bot: FoxyClient;
    constructor(bot) {
        this.bot = bot;
    }

    async checkMessage(message: Message) {
        const guildId = message.guildId;
        const guildInfo = await this.bot.database.getGuild(guildId);
        if (await guildInfo.InviteBlockerModule.isEnabled) {
            if (!this.bot.hasGuildPermission(this.bot, guildId, ["MANAGE_MESSAGES"] || ["ADMINISTRATOR"])) return;
            if (message.authorId === this.bot.applicationId || message.isFromBot || message.webhookId) return;
            const context = new ChatInputMessageContext(message);
            const authorRoles = await message.member.roles.map(role => role ? role.toString().replace("n", "") : null);

            var blockMessage: string = await guildInfo.InviteBlockerModule.blockMessage ?? `Você não pode enviar convites aqui!`;
            blockMessage = blockMessage
                .replace(/{user}/, `<@${message.authorId}>`)
                .replace(/{channel}/, `<#${message.channelId}>`);

            if (!inviteRegex.test(message.content)) return;
            if (authorRoles.find(role => guildInfo.InviteBlockerModule.whitelistedRoles.includes(role))) return;
            if (await guildInfo.InviteBlockerModule.whitelistedChannels.includes(message.channelId)) return;
            if (await guildInfo.InviteBlockerModule.whitelistedUsers.includes(message.authorId)) return;

            if (inviteRegex.test(message.content) && !authorRoles.find(role => guildInfo.InviteBlockerModule.whitelistedRoles.includes(role)) || !authorRoles) {
                const deletionQueue = [];

                function delay(ms) {
                    return new Promise(resolve => setTimeout(resolve, ms));
                }

                function addToDeletionQueue(task) {
                    deletionQueue.push(task);
                }

                async function processDeletionQueue() {
                    while (deletionQueue.length > 0) {
                        const task = deletionQueue.shift();
                        try {
                            await task();
                        } catch (error) {
                            console.error('Erro ao excluir mensagem:', error);
                        }

                        await delay(1000);
                    }
                }
                function isJsonString(str: string) {
                    try {
                        JSON.parse(str);
                    } catch (e) {
                        return false;
                    }
                    return true;
                }

                if (isJsonString(blockMessage)) {
                    const messageObject = JSON.parse(blockMessage);
                    addToDeletionQueue(() => context.DeleteMessage(message.id, "Invite Blocker - Delete message that contains an invite"));
                    context.SendAndDelete({
                        ...messageObject
                    }, 1000);
                    return processDeletionQueue();
                } else {
                    const messageObject = { "content": blockMessage };
                    addToDeletionQueue(() => context.DeleteMessage(message.id, "Invite Blocker - Delete message that contains an invite"));
                    context.SendAndDelete({
                        ...messageObject
                    }, 1000);
                    return processDeletionQueue();
                }
            }
        }
    }
    async checkUpdatedMessage(message: Message) {
        const guildId = message.guildId;
        const guildInfo = await this.bot.database.getGuild(guildId);
        if (await guildInfo.InviteBlockerModule.isEnabled) {
            if (!this.bot.hasGuildPermission(this.bot, guildId, ["MANAGE_MESSAGES"] || ["ADMINISTRATOR"])) return;
            if (message.authorId === this.bot.applicationId || message.isFromBot || message.webhookId) return;
            const context = new ChatInputMessageContext(message);
            const authorRoles = await message.member.roles.map(role => role ? role.toString().replace("n", "") : null);

            var blockMessage: string = guildInfo.InviteBlockerModule.blockMessage
                .replace(/{user}/, `<@${message.authorId}>`)
                .replace(/{channel}/, `<#${message.channelId}>`) ?? `Você não pode enviar convites aqui!`;

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

            if (inviteRegex.test(message.content) && !authorRoles.find(role => guildInfo.InviteBlockerModule.whitelistedRoles.includes(role)) || !authorRoles) {
                function isJsonString(str: string) {
                    try {
                        JSON.parse(str);
                    } catch (e) {
                        return false;
                    }
                    return true;
                }

                if (isJsonString(blockMessage)) {
                    const messageObject = JSON.parse(blockMessage);
                    return context.SendAndDelete({
                        ...messageObject
                    }, 1000);
                } else {
                    const messageObject = { "content": blockMessage };
                    return context.SendAndDelete({
                        ...messageObject
                    }, 1000);
                }
            }
        }
    }
}
