import { bot } from "../FoxyLauncher"
import WelcomerManager from "../utils/modules/WelcomerManager";

const handleWelcomerModule = new WelcomerManager();

const setGuildMemberAddEvent = (): void => {
    bot.events.guildMemberAdd = async (_, member, user) => {
        const guildData = await bot.database.getGuild(member.guildId);
        const guildInfo = await bot.guilds.get(member.guildId);
        
        if (guildData.GuildJoinLeaveModule.isEnabled) {
            handleWelcomerModule.welcomeNewMember(guildInfo, user);
        }
    }
}

export default setGuildMemberAddEvent;