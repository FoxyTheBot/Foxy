import { bot } from "../../index";
import AutoRoleModule from "../../utils/modules/AutoRoleModule";
import WelcomeModule from "../../utils/modules/WelcomeModule";

const setGuildMemberAddEvent = (): void => {
    bot.events.guildMemberAdd = async (_, member) => {
        const AutoRole = new AutoRoleModule(bot);
        const welcomeModule = new WelcomeModule(bot);
        AutoRole.check(member);
        welcomeModule.checkMemberAdd(member);
    }
}

export { setGuildMemberAddEvent }