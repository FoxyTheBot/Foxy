import { getGuildIconURL, Guild, User } from "discordeno";
import DatabaseConnection from "../../../../../common/utils/database/DatabaseConnection";
import { FoxyRestManager } from "../../../../../common/utils/RestManager";
import { getUserAvatar } from "../discord/User";
import { bot } from "../../FoxyLauncher";

export default class WelcomerManager {
    public database: DatabaseConnection;
    public rest: FoxyRestManager;

    constructor() {
        this.rest = new FoxyRestManager();
    }

    private getPlaceholders(guild: Guild, user: User): Record<string, string> {
        const userAvatar = getUserAvatar(user, { size: 2048, enableGif: true });
        const guildIcon = getGuildIconURL(bot, guild.id, guild.icon, { size: 2048 });

        return {
            "{user}": user.username,
            "{@user}": `<@${user.id}>`,
            "{user.id}": user.id.toString(),
            "{guild.name}": guild.name || "Unknown",
            "{guild.id}": guild.id.toString(),
            "{user.avatar}": userAvatar || "",
            "{guild.icon}": guildIcon || "",
        };
    }

    private applyPlaceholders(
        template: string,
        placeholders: Record<string, string>
    ): string {
        let formattedMessage = template;
        for (const [placeholder, value] of Object.entries(placeholders)) {
            formattedMessage = formattedMessage.replace(new RegExp(placeholder, "g"), value);
        }
        return formattedMessage;
    }

    async welcomeNewMember(guild: Guild, user: User) {
        const guildInfo = await bot.database.getGuild(BigInt(guild.id));

        if (guildInfo.GuildJoinLeaveModule.isEnabled) {
            const placeholders = this.getPlaceholders(guild, user);
            const formattedMessage = this.applyPlaceholders(
                guildInfo.GuildJoinLeaveModule.joinMessage,
                placeholders
            );

            await this.rest.sendMessageToAChannelAsJSON(
                guildInfo.GuildJoinLeaveModule.joinChannel,
                formattedMessage
            );
        }
    }

    async byeMember(guildId: string, user: User) {
        const guildInfo = await bot.database.getGuild(BigInt(guildId));

        if (guildInfo.GuildJoinLeaveModule.alertWhenUserLeaves) {
            const placeholders = this.getPlaceholders(
                { ...guildInfo, id: BigInt(guildId) } as any,
                user
            );
            const formattedMessage = this.applyPlaceholders(
                guildInfo.GuildJoinLeaveModule.leaveMessage,
                placeholders
            );

            await this.rest.sendMessageToAChannelAsJSON(
                guildInfo.GuildJoinLeaveModule.leaveChannel,
                formattedMessage
            );
        }
    }
}