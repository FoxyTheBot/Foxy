import { FoxyClient } from "../../structures/types/foxy";

export default class GuildJoinLeaveModule {
    public bot: FoxyClient;
    constructor(bot) {
        this.bot = bot;
    }

    async guildJoin(guildId, member) {
        const guildInfo = await this.bot.database.getGuild(guildId);
        const guildInfoFromAPI = await this.bot.helpers.getGuild(guildId);

        if (guildInfo.GuildJoinLeaveModule.isEnabled) {
            const message = await guildInfo.GuildJoinLeaveModule.joinMessage ?? {
                "content": `{user} has joined the server.`
            }
            const updatedMessage = message.replace(/{user}/g, `<@${member.id}>`)
                .replace(/{username}/g, `${member.username}`)
                .replace(/{server}/g, `${guildInfoFromAPI.name}`)

            const messageObject = JSON.parse(updatedMessage);
            const channelId = await guildInfo.GuildJoinLeaveModule.joinChannel;

            try {
                setTimeout(() => {
                    this.bot.helpers.sendMessage(channelId, {
                        ...messageObject
                    });
                }, 500);
            } catch (err) {
                console.error(err)
            }
        }
    }

    async guildLeave(guildId, member) {
        const guildInfo = await this.bot.database.getGuild(guildId);

        if (guildInfo.GuildJoinLeaveModule.alertWhenUserLeaves) {
            const message = await guildInfo.GuildJoinLeaveModule.leaveMessage ?? {
                "content": `{user} leaves from the server.`
            }
            const updatedMessage = message.replace(/{user}/g, `<@${member.id}>`)
                .replace(/{username}/g, `${member.username}`)

            const messageObject = JSON.parse(updatedMessage);
            const channelId = await guildInfo.GuildJoinLeaveModule.leaveChannel;

            try {
                setTimeout(() => {
                    this.bot.helpers.sendMessage(channelId, {
                        ...messageObject
                    });
                }, 500);
            } catch (err) {
                console.error(err)
            }
        }
    }
}

export { GuildJoinLeaveModule }