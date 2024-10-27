import { getGuildIconURL, Guild, User } from "discordeno";
import DatabaseConnection from "../../../common/utils/database/DatabaseConnection";
import { FoxyRestManager } from "../../../common/utils/RestManager";

export default class WelcomerManager {
    public database: DatabaseConnection;
    public rest: FoxyRestManager;

    constructor() {
        this.database = new DatabaseConnection();
        this.rest = new FoxyRestManager();
    }

    async welcomeNewMember(guild: Guild, user: User) {
        const guildInfo = await this.database.getGuild(BigInt(guild.id));

        if (guildInfo.GuildJoinLeaveModule.isEnabled) {
            const replacements: Record<string, string> = {
                "{user}": user.username,
                "{@user}": `<@${user.id}>`,
                "{user.id}": user.id.toString(),
                "{guild.name}": guild.name,
                "{guild.id}": guild.id.toString(),
                "{user.avatar}": user.avatar.toString(),
                "{guild.icon}": guild.icon.toString(),
            };
    
            let formattedMessage = guildInfo.GuildJoinLeaveModule.joinMessage;
    
            for (const [placeholder, value] of Object.entries(replacements)) {
                formattedMessage = formattedMessage.replace(new RegExp(placeholder, 'g'), value);
            }
    
            await this.rest.sendMessageToAChannelAsJSON(
                guildInfo.GuildJoinLeaveModule.joinChannel,
                formattedMessage
            );
        }
    }
    
    async byeMember(guildId: string, user: User) {
        const guildInfo = await this.database.getGuild(BigInt(guildId));
    
        if (guildInfo.GuildJoinLeaveModule.alertWhenUserLeaves) {
            const replacements: Record<string, string> = {
                "{user}": user.username,
                "{@user}": `<@${user.id}>`,
                "{user.id}": user.id.toString(),
                "{guild.id}": guildId,
                "{user.avatar}": user.avatar.toString(),
                "{guild.icon}": guildInfo.icon.toString()
            };
    
            let formattedMessage = guildInfo.GuildJoinLeaveModule.leaveMessage;
    
            for (const [placeholder, value] of Object.entries(replacements)) {
                formattedMessage = formattedMessage.replace(new RegExp(placeholder, 'g'), value);
            }
    
            await this.rest.sendMessageToAChannelAsJSON(
                guildInfo.GuildJoinLeaveModule.leaveChannel,
                formattedMessage
            );
        }
    }
}