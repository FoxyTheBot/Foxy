import { Message } from 'discordeno/transformers';
import { BigString, CreateMessage, User } from 'discordeno';
import { bot } from "../../FoxyLauncher";

export default class {
    public replied = false;

    constructor(public message: Message) { }

    get authorId() {
        return this.message.authorId;
    }

    get author() {
        const user = bot.users.get(this.message.authorId) || bot.helpers.getUser(this.message.authorId);
        return user;
    }

    get commandName() {
        return this.message.content.split(' ')[0].replace('f!', '');
    }

    makeReply(emoji: BigInt, message: string) {
        return `${this.getEmojiById(emoji)} | ${message}`;
    }

    async sendReply(options: CreateMessage) {
        await bot.helpers.sendMessage(this.message.channelId, {
            ...options,
            messageReference: {
                messageId: this.message.id,
                failIfNotExists: false
            }
        })
        this.replied = true;
    }

    async getUser(userId: string): Promise<User> {
        const id = userId ? userId.replace(/[^0-9]/g, '') : userId || this.message.authorId;
        return bot.users.get(BigInt(id)) || await bot.helpers.getUser(id);
    }

    getEmojiById(id: BigInt) {
        return `<:emoji:${id}>`;
    }

    async SendAndDelete(options: CreateMessage, timeout: number) {
        const message = await bot.helpers.sendMessage(this.message.channelId, {
            ...options,
        });

        setTimeout(async () => {
            bot.helpers.deleteMessage(this.message.channelId, message.id, "Delete message after timeout");
        }, timeout);
    }

    async sendMessage(channelId: string, options: CreateMessage) {
        bot.helpers.sendMessage(channelId, {
            ...options,
        });
    }

    async DeleteMessage(messageId: BigString, reason: string) {
        bot.helpers.deleteMessage(this.message.channelId, messageId, reason);
    }
}