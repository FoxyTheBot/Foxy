import { bot } from "../../index";
import AutoRoleModule from "../../utils/modules/AutoRoleModule";
import GuildJoinLeaveModule from "../../utils/modules/GuildJoinLeaveModule";

const setGuildMemberAddEvent = (): void => {
    bot.events.guildMemberAdd = async (_, member) => {
        const AutoRole = new AutoRoleModule(bot);
        const GuildJoinLeave = new GuildJoinLeaveModule(bot);

        GuildJoinLeave.guildJoin(member.guildId, member);
        AutoRole.check(member);
        console.log("called")
    }
}

export { setGuildMemberAddEvent }