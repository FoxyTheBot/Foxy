import { InteractionResponseTypes, InteractionCallbackData, ApplicationCommandOptionTypes, } from 'discordeno';
import { Interaction, User } from 'discordeno/transformers';
import { TFunction } from 'i18next';
import { MessageFlags } from '../../utils/discord/Message';
import { bot } from "../../index";
import { get } from 'https'
import { URL } from 'url';
import { getOptionFromInteraction } from './GetCommandOption';
import { foxyAPIToken } from '../../../config.json';

export type CanResolve = 'users' | 'members' | false;

export default class {
    public replied = false;
    public subCommand: string | undefined;
    public subCommandGroup: string | undefined;
    constructor(
        public interaction: Interaction,
        public i18n: TFunction,
    ) {
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
        return this.interaction.user;
    }

    get commandId(): bigint {
        return this.interaction.data?.id ?? 0n;
    }

    get channelId(): bigint {
        return this.interaction.channelId ?? 0n;
    }

    get guildId(): bigint {
        return this.interaction.guildId ?? 0n;
    }

    get guildMember() {
        return this.interaction.member;
    }

    makeReply(emoji: any, text: string): string {
        return `${`<:emoji:${emoji}>` || '🐛'} **|** ${text}`;
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

    convertToDiscordTimestamp(date: Date, type: "relative" | "shorttime" | "longtime" | "long-and-relative"): string {
        switch (type) {
            case "relative":
                return `<t:${Math.floor(date.getTime() / 1000).toFixed(0)}:R>`;
            case "shorttime":
                return `<t:${Math.floor(date.getTime() / 1000).toFixed(0)}:t>`;
            case "longtime":
                return `<t:${Math.floor(date.getTime() / 1000).toFixed(0)}:T>`;
            case "long-and-relative":
                return `<t:${Math.floor(date.getTime() / 1000).toFixed(0)}:f> (<t:${Math.floor(date.getTime() / 1000).toFixed(0)}:R>)`;
        }
    }

    getContent(url) {
        return new Promise((resolve, reject) => {
            get(url, {
                headers: {
                    'Authorization': `${foxyAPIToken}`,
                }
            }, (res) => {
                const { statusCode } = res;
                if (statusCode !== 200) {
                    res.resume();
                    reject(`Request failed. Status code: ${statusCode}`);
                }
                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => { rawData += chunk });
                res.on('end', () => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        resolve(parsedData);
                    } catch (e) {
                        reject(`Error: ${e}`);
                    }
                });
            }).on('error', (err) => {
                reject(`Error: ${err.message}`);
            })
        });
    }


    async getImage(command: string) {
        let baseURL = 'https://cakey.foxybot.win/images/';
        let url = new URL(baseURL + command);
        return await this.getContent(url.toString());
    }

    async sendReply(options: InteractionCallbackData & { attachments?: unknown[] }): Promise<void> {
        if (this.replied) {
            await bot.helpers
                .editOriginalInteractionResponse(this.interaction.token, options)
            return;
        }

        this.replied = true;

        await bot.helpers.sendInteractionResponse(this.interaction.id, this.interaction.token, {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: options,
        })
    }

    getSubCommandGroup(required = false): string {
        const command = this.subCommandGroup;

        if (!command && required)
            throw new Error(`SubCommandGroup is required in ${this.interaction.data?.name}`);

        return command as string;
    }

    getSubCommand(): string {
        const command = this.subCommand;

        if (!command) throw new Error(`SubCommand is required in ${this.interaction.data?.name}`);

        return command as string;
    }

    getOption<T>(name: string, shouldResolve: CanResolve, required: true): T;

    getOption<T>(name: string, shouldResolve: CanResolve, required?: false): T | undefined;

    getOption<T>(name: string, shouldResolve: CanResolve, required?: boolean): T | undefined {
        return getOptionFromInteraction<T>(this.interaction, name, shouldResolve, required);
    }

    toDiscordTimestamp(date: Date): string {
        return `<t:${Math.floor(date.getTime() / 1000).toFixed(0)}:f>`
    }

    async sendDefer(EPHEMERAL = false): Promise<void> {
        this.replied = true;
        await bot.helpers
            .sendInteractionResponse(this.interaction.id, this.interaction.token, {
                type: InteractionResponseTypes.DeferredChannelMessageWithSource,
                data: {
                    flags: EPHEMERAL ? MessageFlags.EPHEMERAL : undefined,
                },
            })
    }

    locale(text: string, options: Record<string, unknown> = {}): string {
        return this.i18n(text, options);
    }
}