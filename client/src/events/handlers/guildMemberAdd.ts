import { bot } from "../../index";
import AutoRoleModule from "../../utils/modules/AutoRoleModule";

const setGuildMemberAddEvent = (): void => {
    bot.events.guildMemberAdd = async (_, member) => {
        const AutoRole = new AutoRoleModule(bot);
        AutoRole.check(member);
    }
}

export { setGuildMemberAddEvent }