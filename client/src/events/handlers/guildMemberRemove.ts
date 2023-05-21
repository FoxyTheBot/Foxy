import { bot } from "../..";
import WelcomeModule from "../../utils/modules/WelcomeModule";

const setGuildMemberRemoveEvent = (): void => {
    bot.events.guildMemberRemove = async (_, member, guildId) => {
        const welcomeModule = new WelcomeModule(bot);
        welcomeModule.checkMemberRemove(member, guildId);
    }
}

export { setGuildMemberRemoveEvent }