import { bot } from "../../index";
import AutoRoleModule from "../../utils/modules/AutoRoleModule";
import WelcomeModule from "../../utils/modules/WelcomeModule";

const setGuildMemberAddEvent = (): void => {
    bot.events.guildMemberAdd = async (_, member) => {
        const AutoRole = new AutoRoleModule(bot);
        const WelcomeLeave = new WelcomeModule(bot);
        AutoRole.check(member);
        WelcomeLeave.checkMemberAdd(member);
    }
}

export { setGuildMemberAddEvent }