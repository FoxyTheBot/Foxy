import { Message } from 'discordeno/transformers';
import { BigString, CreateMessage } from 'discordeno';
import { bot } from "../../index";

export default class {
    public replied = false;

    constructor(public message: Message) { }
    
    get authorRoles() {
        return this.message.member.roles;
    }
    async FoxyReply(options: CreateMessage) {
        bot.helpers.sendMessage(this.message.channelId, {
            ...options,
        });

        this.replied = true;
    }

    async DeleteMessage(messageId: BigString, reason: string) {
        bot.helpers.deleteMessage(this.message.channelId, messageId, reason );
    }

}