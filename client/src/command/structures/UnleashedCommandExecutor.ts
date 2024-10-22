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

export type CanResolve = 'users' | 'members' | false;

export default class UnleashedCommandExecutor {
    public replied = false;
    public subCommand?: string;
    public subCommandGroup?: string;
    public currentPremiumTier?: string

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

    async followUp(options: InteractionCallbackData | CreateMessage): Promise<void> {
        const { interaction, message } = this;
        const messageOptions = options as CreateMessage;

        if (interaction) {
            await bot.helpers.sendFollowupMessage(interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: options as InteractionCallbackData,
            });
        } else if (message) {
            await bot.helpers.sendMessage(message.channelId, {
                ...messageOptions,
                messageReference: {
                    messageId: message.id,
                    failIfNotExists: false
                }
            });
        }
    }

    makeReply(emoji: string, text: string): string {
        return `<:emoji:${emoji}> **|** ${text}` || `<:emoji:${bot.emotes.FOXY_WOW}> **|** ${text}`;
    }

    async sendReply(options: InteractionCallbackData & { attachments?: unknown[] }): Promise<void> {
        const { interaction, message } = this;

        if (interaction) {
            if (this.replied) {
                await bot.helpers.editOriginalInteractionResponse(interaction.token, options);
            } else {
                this.replied = true;
                await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
                    type: InteractionResponseTypes.ChannelMessageWithSource,
                    data: options,
                });
            }
        } else if (message) {
            await bot.helpers.sendMessage(message.channelId, {
                ...options as CreateMessage,
                messageReference: {
                    messageId: message.id,
                    failIfNotExists: false
                }
            });
        }
    }

    async getUserPremiumTier(): Promise<string> {
        const user = await bot.database.getUser(this.author.id);
        return getTier(user.userPremium.premiumType, user.userPremium.premiumDate);
    }

    getEmojiById(id: bigint | string): string {
        return `<:emoji:${id}>`;
    }

    convertToDiscordTimestamp(date: Date, type: DiscordTimestamp): string {
        const timestamp = Math.floor(date.getTime() / 1000);
        const formats = ["R", "t", "T", "f"];
        return `<t:${timestamp}:${formats[type]}>${type === 3 ? ` (<t:${timestamp}:R>)` : ''}`;
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
        if (this.interaction) {
            return getOptionFromInteraction<T>(this.interaction, name, shouldResolve, required);
        } else {
            return getArgsFromMessage<T>(this.message?.content || '', name, position, shouldResolve, this.message, required) as unknown as T;
        }
    }

    async sendDefer(ephemeral = false): Promise<void> {
        if (!this.interaction) return;

        this.replied = true;
        await bot.helpers.sendInteractionResponse(this.interaction.id, this.interaction.token, {
            type: InteractionResponseTypes.DeferredChannelMessageWithSource,
            data: {
                flags: ephemeral ? MessageFlags.EPHEMERAL : undefined,
            },
        });
    }
}
