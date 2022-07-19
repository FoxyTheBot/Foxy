import FoxyClient from "../../FoxyClient";
import { CommandInteraction, Guild, InteractionReplyOptions, Message, MessagePayload, TextBasedChannel, User } from "discord.js";
import { APIMessage } from "discord-api-types/v10";

export default class InteractionContext {
    constructor(
        public interaction: CommandInteraction & { client: FoxyClient },
    ) {
    }

    get client(): FoxyClient {
        return this.interaction.client;
    }

    get createdTimestamp(): number {
        return this.interaction.createdTimestamp;
    }

    get options() {
        return this.interaction.options;
    }

    get type() {
        return this.interaction.type;
    }

    get guild(): Guild {
        return this.interaction.guild;
    }

    get channel(): TextBasedChannel {
        return this.interaction.channel as TextBasedChannel;
    }

    get tag(): string {
        return `${this.interaction.user.username}#${this.interaction.user.discriminator}`
    }

    get user(): User {
        return this.interaction.user;
    }

    async deferReply(ephemeral, options?: MessagePayload | InteractionReplyOptions): Promise<void> {
        if (this.interaction.deferred && options) {
            await this.followUp(options);
            return;
        }

        await this.interaction.deferReply({ ephemeral });
    }

    async reply(options: InteractionReplyOptions): Promise<Message> {
        if (this.interaction.replied || this.interaction.deferred) {
            return this.checkReply(await this.interaction.editReply(options));
        }

        return this.checkReply(await this.interaction.reply({ ...options, fetchReply: true }))
    }

    private checkReply(message: Message | APIMessage | null): Message | null {
        if (!message) return null;
        if (message instanceof Message) return message;
        // @ts-expect-error Message constructor is private
        return new Message(this.client, message);
    }

    async followUp(options: MessagePayload | InteractionReplyOptions): Promise<Message> {
        return this.checkReply(await this.interaction.followUp(options))
    }

    async fetchReply(): Promise<Message> {
        return this.checkReply(await this.interaction.fetchReply());
    }

    public async getContext(i, type, user?) {
        switch (type) {
            case 1: { // Use in interactions where the author of the command has to press the button
                if (this.user.id === i.user.id) {
                    return true;
                } else if (this.user.id !== i.user.id) {
                    return null;
                }
            }

            case 2: { // Use in interactions where the mentioned user has to press the button
                if (this.user.id !== user.id) {
                    if (this.user.id === i.user.id || i.user.id !== user.id) {
                        return null;
                    } else if (this.user.id !== i.user.id) {
                        return true;
                    }
                } else {
                    return true;
                }
            }

            default: {
                throw Error("You must select between 1 or 2!")
            }
        }
    }
}