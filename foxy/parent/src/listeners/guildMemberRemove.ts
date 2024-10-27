import { WelcomerEvent } from "../../../../common/types/WelcomerEvent";
import { bot } from "../FoxyLauncher"

const setGuildMemberRemoveEvent = (): void => {
    bot.events.guildMemberRemove = async (_, user, guildId) => {
        const guildData = await bot.database.getGuild(guildId);
        const guildInfo = await bot.guilds.get(guildId);

        if (guildData.GuildJoinLeaveModule.alertWhenUserLeaves) {
            const event: WelcomerEvent = {
                type: "GUILD_MEMBER_REMOVE",
                data: {
                    guild: guildInfo,
                    user: user
                }
            }

            bot.ws.send(event);
        }
    }
}

export default setGuildMemberRemoveEvent;