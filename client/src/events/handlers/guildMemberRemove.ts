import { bot } from "../../index";
import GuildJoinLeaveModule from "../../utils/modules/GuildJoinLeaveModule";

const setGuildMemberRemoveEvent = (): void => {
    bot.events.guildMemberRemove = async (_, member, guildId) => {
        const GuildJoinLeave = new GuildJoinLeaveModule(bot);
        GuildJoinLeave.guildLeave(guildId, member);
        console.log("called")
    }
}

export { setGuildMemberRemoveEvent }