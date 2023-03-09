import { InteractionResponseTypes, InteractionCallbackData } from 'discordeno';
import { User } from 'discordeno/transformers';
import { ComponentInteraction } from '../types/interaction';
import { bot } from "../../index";

export type CanResolve = 'users' | 'members' | false;
export default class <InteractionType extends ComponentInteraction = ComponentInteraction> {
    private replied = false;

    constructor(public interaction: InteractionType) { }

    get user(): User {
        return this.interaction.user;
    }

    get author(): User {
        return this.interaction.message?.interaction?.user as User;
    }

    get channelId(): bigint {
        return this.interaction.channelId ?? 0n;
    }

    get commandId(): bigint {
        return BigInt(this.interaction.data.customId.split('|')[2]);
    }

    get sentData(): string[] {
        return this.interaction.data.customId.split('|').slice(3);
    }

    makeReply(emoji: any, text: any): string {
        return `<:emoji:${emoji}> **|** ${text}`;
    }

    async respondInteraction(options: InteractionCallbackData & { attachments?: unknown[] },): Promise<void> {
        if (!this.replied) {
            await bot.helpers.sendInteractionResponse(this.interaction.id, this.interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: options,
            })
            this.replied = true;
            return;
        }

        await bot.helpers.editOriginalInteractionResponse(this.interaction.token, options)
    }

    async followUp(options: InteractionCallbackData): Promise<void> {
        await bot.helpers.sendFollowupMessage(this.interaction.token, {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: options,
        })
    }
    
    getEmojiById(id: BigInt) {
        return `<:emoji:${id}>`;
    }

    async sendReply(options: InteractionCallbackData & { attachments?: unknown[] }): Promise<void> {
        if (!this.replied) {
            this.replied = true;
            await bot.helpers.sendInteractionResponse(this.interaction.id, this.interaction.token, {
                type: InteractionResponseTypes.UpdateMessage,
                data: options,
            })
            return;
        }

        await bot.helpers.editOriginalInteractionResponse(this.interaction.token, options)
    }
}