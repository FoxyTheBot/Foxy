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

export type CanResolve = 'users' | 'members' | false;

export default class UnleashedCommandExecutor {
    public replied = false;
    public subCommand: string | undefined;
    public subCommandGroup: string | undefined;

    constructor(
        public i18n: TFunction,
        public message?: Message | null,
        public interaction?: Interaction | null,
    ) {
        if (interaction) {
            let options = interaction.data?.options ?? [];

            if (options[0]?.type === ApplicationCommandOptionTypes.SubCommandGroup) {
                this.subCommandGroup = options[0].name;
                options = options[0].options ?? [];
            }

            if (options[0]?.type === ApplicationCommandOptionTypes.SubCommand) {
                this.subCommand = options[0].name;
            }
        }
    }

    get author(): User {
        return this.interaction ? this.interaction.user : bot.users.get(this.message.authorId);
    }

    get commandId(): bigint {
        return this.interaction ? this.interaction.data?.id : this.message.id;
    }

    get isMessage(): boolean {
        return !!this.message;
    }

    get channelId(): bigint {
        return this.interaction ? this.interaction.channelId : this.message.channelId;
    }

    get guildId(): bigint {
        return this.interaction ? this.interaction.guildId : this.message.guildId;
    }

    get guildMember() {
        return this.interaction ? this.interaction.member : this.message.member;
    }

    async followUp(options): Promise<void> {
        if (this.interaction) {
            await bot.helpers.sendFollowupMessage(this.interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: options as InteractionCallbackData,
            });
        } else {
            await bot.helpers.sendMessage(this.message.channelId, {
                ...options as CreateMessage,
                messageReference: {
                    messageId: this.message.id,
                    failIfNotExists: false
                }
            });
        }
    }

    makeReply(emoji: string, text: string): string {
        return `${`<:emoji:${emoji}>` || `<:emoji:${bot.emotes.FOXY_WOW}>`} **|** ${text}`;
    }

    async sendReply(options: InteractionCallbackData & { attachments?: unknown[] }): Promise<void> {
        if (this.interaction) {
            if (this.replied) {
                await bot.helpers.editOriginalInteractionResponse(this.interaction.token, options);
                return;
            }

            this.replied = true;

            await bot.helpers.sendInteractionResponse(this.interaction.id, this.interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: options,
            });
        } else {
            await bot.helpers.sendMessage(this.message.channelId, {
                ...options as CreateMessage,
                messageReference: {
                    messageId: this.message.id,
                    failIfNotExists: false
                }
            })
        }
    }

    getEmojiById(id: BigInt | string): string {
        return `<:emoji:${id}>`;
    }

    convertToDiscordTimestamp(date: Date, type: DiscordTimestamp): string {
        const timestamp = Math.floor(date.getTime() / 1000).toFixed(0);
        switch (type) {
            case 0:
                return `<t:${timestamp}:R>`;
            case 1:
                return `<t:${timestamp}:t>`;
            case 2:
                return `<t:${timestamp}:T>`;
            case 3:
                return `<t:${timestamp}:f> (<t:${timestamp}:R>)`;
        }
    }

    locale(text: string, options: Record<string, unknown> = {}): string {
        return this.i18n(text, options);
    }

    getSubCommandGroup(required = false): string {
        const command = this.subCommandGroup;

        if (!command && required)
            throw new Error(`SubCommandGroup is required in ${this.interaction.data?.name}`);

        return command as string;
    }

    getSubCommand(): string {
        if (this.interaction) {
            const command = this.subCommand;
            if (!command) throw new Error(`SubCommand is required in ${this.interaction.data?.name}`);

            return command as string;
        } else {
            return this.message.content.split(' ')[0].replace(process.env.DEFAULT_PREFIX, '');
        }
    }

    getOption<T>(name: string, shouldResolve: CanResolve, required: true, position?: number): T;

    getOption<T>(name: string, shouldResolve: CanResolve, required?: false, position?: number): T | undefined;

    getOption<T>(name: string, shouldResolve: CanResolve, required?: boolean, position?: number): T | undefined {
        if (this.interaction) {
            return getOptionFromInteraction<T>(this.interaction, name, shouldResolve, required);
        } else {
            return getArgsFromMessage<T>(this.message.content, name, position || 1, shouldResolve, this.message, required) as unknown as T;
        }
    }

    async sendDefer(EPHEMERAL = false): Promise<void> {
        if (this.interaction) {
            this.replied = true;
            await bot.helpers.sendInteractionResponse(this.interaction.id, this.interaction.token, {
                type: InteractionResponseTypes.DeferredChannelMessageWithSource,
                data: {
                    flags: EPHEMERAL ? MessageFlags.EPHEMERAL : undefined,
                },
            });
        } else {
            return null;
        }
    }
}