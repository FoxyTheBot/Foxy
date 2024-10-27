import { bot } from "../FoxyLauncher"
import { WelcomerEvent } from "../../../../common/types/WelcomerEvent";
const setGuildMemberAddEvent = (): void => {
    bot.events.guildMemberAdd = async (_, member, user) => {
        const guildData = await bot.database.getGuild(member.guildId);
        const guildInfo = await bot.guilds.get(member.guildId);
        if (guildData.GuildJoinLeaveModule.isEnabled) {
            const event: WelcomerEvent = {
                type: "GUILD_MEMBER_ADD",
                data: {
                    guild: guildInfo,
                    user: user
                }
            }

            bot.ws.send(event);
        }
    }
}

export default setGuildMemberAddEvent;