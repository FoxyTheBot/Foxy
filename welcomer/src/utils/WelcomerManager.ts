import { Guild, User } from "discordeno";
import DatabaseConnection from "../../../common/utils/database/DatabaseConnection";
import { FoxyRestManager } from "../../../common/utils/RestManager";

export default class WelcomerManager {
    public database: DatabaseConnection;
    public rest: FoxyRestManager;

    constructor() {
        this.database = new DatabaseConnection();
        this.rest = new FoxyRestManager();
    }

    private getPlaceholders(guild: Guild, user: User): Record<string, string> {
        return {
            "{user}": user.username,
            "{@user}": `<@${user.id}>`,
            "{user.id}": user.id.toString(),
            "{guild.name}": guild.name,
            "{guild.id}": guild.id.toString(),
            "{user.avatar}": user.avatar?.toString() || "",
            "{guild.icon}": guild.icon.toString() || "",
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
        const guildInfo = await this.database.getGuild(BigInt(guild.id));

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
        const guildInfo = await this.database.getGuild(BigInt(guildId));

        if (guildInfo.GuildJoinLeaveModule.alertWhenUserLeaves) {
            const placeholders = this.getPlaceholders(
                { ...guildInfo, id: BigInt(guildId) } as Guild,
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