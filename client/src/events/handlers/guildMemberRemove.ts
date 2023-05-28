import { bot } from "../..";
import WelcomeModule from "../../utils/modules/WelcomeModule";

const setGuildMemberRemove = (): void => {
    bot.events.guildMemberRemove = async (_, member, guildId) => {
        const WelcomeLeave = new WelcomeModule(bot);
        WelcomeLeave.checkMemberRemove(member, guildId);
    }
}

export { setGuildMemberRemove }