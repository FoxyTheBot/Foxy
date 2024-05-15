import { Message } from 'discordeno/transformers';
import { BigString, CreateMessage } from 'discordeno';
import { bot } from "../../FoxyLauncher";

export default class {
    public replied = false;

    constructor(public message: Message) { }

    async FoxyReply(options: CreateMessage) {
        bot.helpers.sendMessage(this.message.channelId, {
            ...options,
        });

        this.replied = true;
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
        bot.helpers.deleteMessage(this.message.channelId, messageId, reason );
    }

}