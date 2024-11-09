import { Member } from "discordeno/transformers";
import { bot } from "../FoxyLauncher"
import WelcomerManager from "../utils/modules/WelcomerManager";
import { Bot } from "discordeno";

const handleWelcomerModule = new WelcomerManager();

const setGuildMemberAddEvent = async (_: Bot, member: Member): Promise<void> => {
    const guildData = await bot.database.getGuild(member.guildId);
    const guildInfo = await bot.guilds.get(member.guildId);

    if (guildData.GuildJoinLeaveModule.isEnabled) {
        handleWelcomerModule.welcomeNewMember(guildInfo, member.user);
    }
}

export default setGuildMemberAddEvent;