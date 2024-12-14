import { Guild, Member } from "discordeno/transformers";
import { ExtendedUser } from "../../structures/types/DiscordUser";
import { FoxyClient } from "../../structures/types/FoxyClient";
import { logger } from "../../../../../common/utils/logger";
import { DiscordTimestamp } from "../../structures/types/DiscordTimestamps";

export default class FoxyHelpers {
    private bot: FoxyClient;

    constructor(bot: FoxyClient) {
        this.bot = bot;
        logger.info('[UTILS] FoxyHelpers initialized');
    }

    async getUser(id: string | bigint): Promise<ExtendedUser | null> {
        const idAsStr = String(id);
        const response = this.bot.users.get(BigInt(idAsStr)) ?? await this.bot.rest.foxy.getUser(idAsStr);
        if (!response) return null;

        const user = await response as ExtendedUser;
        return {
            ...user,
            asMention: `<@${user.id}>`
        }
    }

    async getGuild(id: string | bigint): Promise<Guild | null> {
        return this.bot.guilds.get(BigInt(id)) ?? await this.bot.rest.foxy.getGuild(String(id)) ?? null;
    }

    async getMember(userId: string | bigint, guildId: string | bigint): Promise<Member | null> {
        const response = this.bot.members.get(BigInt(userId))
            ?? await this.bot.rest.foxy.getUserAsMember(String(userId), String(guildId));
        
        if (!response) return null;

        return await response as Member;
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
}