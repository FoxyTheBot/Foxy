import {
    InteractionResponseTypes,
    InteractionCallbackData,
    ApplicationCommandOptionTypes,
    Message,
    CreateMessage
} from 'discordeno';
import { Interaction, User } from 'discordeno/transformers';
import { TFunction } from 'i18next';
import { MessageFlags } from '../../utils/discord/Message';
import { bot } from "../../FoxyLauncher";
import { getArgsFromMessage, getOptionFromInteraction } from './GetCommandOption';
import { DiscordTimestamp } from '../../structures/types/DiscordTimestamps';
import { getTier } from '../../structures/types/PremiumTiers';

export type CanResolve = 'users' | 'members' | 'attachments' | 'full-string' | false;

export default class UnleashedCommandExecutor {
    public replied = false;
    public subCommand?: string;
    public subCommandGroup?: string;
    public currentPremiumTier?: string;

    constructor(
        public i18n: TFunction,
        public message?: Message | null,
        public interaction?: Interaction | null,
    ) {
        if (interaction) {
            this.initializeSubCommandOptions(interaction);
        }
    }

    private initializeSubCommandOptions(interaction: Interaction): void {
        let options = interaction.data?.options ?? [];
        
        if (options[0]?.type === ApplicationCommandOptionTypes.SubCommandGroup) {
            this.subCommandGroup = options[0].name;
            options = options[0].options ?? [];
        }

        if (options[0]?.type === ApplicationCommandOptionTypes.SubCommand) {
            this.subCommand = options[0].name;
        }
    }

    get author(): User {
        return this.interaction ? this.interaction.user : bot.users.get(this.message.authorId);
    }

    get commandId(): bigint {
        return this.interaction?.data?.id ?? this.message.id;
    }

    get isMessage(): boolean {
        return !!this.message;
    }

    get channelId(): bigint {
        return this.interaction?.channelId ?? this.message.channelId;
    }

    get guildId(): bigint {
        return this.interaction?.guildId ?? this.message.guildId;
    }

    get guildMember() {
        return this.interaction?.member ?? this.message.member;
    }

    getMessage(argumentPosition?: number): string {
        if (!argumentPosition) {
            return this.message?.content.split(' ').slice(1).join(' ') || '';
        }
        return this.message?.content.split(' ')[argumentPosition] || '';
    }

    async followUp(options: InteractionCallbackData | CreateMessage): Promise<void> {
        if (this.interaction) {
            await bot.helpers.sendFollowupMessage(this.interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: options as InteractionCallbackData,
            });
        } else if (this.message) {
            await this.sendMessageToChannel(options as CreateMessage);
        }
    }

    private async sendMessageToChannel(options: CreateMessage): Promise<boolean> {
        await bot.helpers.sendMessage(this.message.channelId, {
            ...options,
            messageReference: {
                messageId: this.message.id,
                failIfNotExists: false,
            }
        });

        return true;
    }

    makeReply(emoji: string, text: string): string {
        return `<:emoji:${emoji}> **|** ${text}` || `<:emoji:${bot.emotes.FOXY_WOW}> **|** ${text}`;
    }

    async reply(options: InteractionCallbackData & { attachments?: unknown[] }): Promise<void> {
        if (this.interaction) {
            await this.replyToInteraction(options);
        } else if (this.message) {
            bot.helpers.triggerTypingIndicator(this.message.channelId);
            await this.sendMessageToChannel(options as CreateMessage);
        }
    }

    private async replyToInteraction(options: InteractionCallbackData): Promise<void> {
        try {
            if (this.replied) {
                await bot.helpers.editOriginalInteractionResponse(this.interaction.token, options);
            } else {
                this.replied = true;
                await bot.helpers.sendInteractionResponse(this.interaction.id, this.interaction.token, {
                    type: InteractionResponseTypes.ChannelMessageWithSource,
                    data: options,
                });
            }
        } catch (error) {
            console.error('Failed to respond to interaction:', error);
            throw new Error('Failed to send response to interaction');
        }
    }

    async getUserPremiumTier(): Promise<string> {
        try {
            const user = await bot.database.getUser(this.author.id);
            return getTier(user.userPremium.premiumType, user.userPremium.premiumDate);
        } catch (error) {
            console.error('Failed to get user premium tier:', error);
            throw new Error('Could not retrieve user premium tier');
        }
    }

    getEmojiById(id: bigint | string): string {
        return `<:emoji:${id}>`;
    }

    convertToDiscordTimestamp(date: Date, type: DiscordTimestamp): string {
        const timestamp = Math.floor(date.getTime() / 1000);
        const formats = ["R", "t", "T", "f"];
        
        if (type === 3) {
            return `<t:${timestamp}:${formats[type]}> (<t:${timestamp}:R>)`;
        } else {
            return `<t:${timestamp}:${formats[type]}>`;
        }
    }
    

    locale(text: string, options: Record<string, unknown> = {}): string {
        return this.i18n(text, options);
    }

    getSubCommandGroup(required = false): string | undefined {
        if (required && !this.subCommandGroup) {
            throw new Error(`SubCommandGroup is required in ${this.interaction?.data?.name}`);
        }
        return this.subCommandGroup;
    }

    getSubCommand(required = true): string {
        if (this.interaction) {
            if (required && !this.subCommand) {
                throw new Error(`SubCommand is required in ${this.interaction?.data?.name}`);
            }
            return this.subCommand as string;
        } else {
            return this.message?.content.split(' ')[0].replace(process.env.DEFAULT_PREFIX, '') || '';
        }
    }

    getOption<T>(name: string, shouldResolve: CanResolve, required = false, position = 1): T | undefined {
        return this.interaction 
            ? getOptionFromInteraction<T>(this.interaction, name, shouldResolve, required) 
            : getArgsFromMessage<T>(this.message?.content || '', name, position, shouldResolve, this.message, required) as unknown as T;
    }

    async sendDefer(ephemeral = false): Promise<void> {
        if (this.interaction) {
            this.replied = true;
            await bot.helpers.sendInteractionResponse(this.interaction.id, this.interaction.token, {
                type: InteractionResponseTypes.DeferredChannelMessageWithSource,
                data: {
                    flags: ephemeral ? MessageFlags.EPHEMERAL : undefined,
                },
            });
        } else {
            bot.helpers.startTyping(this.message.channelId);
        }
    }
}