import { Member, User } from "discordeno/transformers";
import { bot } from "../FoxyLauncher"
import WelcomerManager from "../utils/modules/WelcomerManager";
import { Bot } from "discordeno";

const handleWelcomerModule = new WelcomerManager();

const setGuildMemberAddEvent = async (_: Bot, member: Member, user: User): Promise<void> => {
    const guildData = await bot.database.getGuild(member.guildId);
    const guildInfo = await bot.helpers.foxy.getGuild(member.guildId);

    if (guildData.GuildJoinLeaveModule.isEnabled) {
        handleWelcomerModule.welcomeNewMember(guildInfo, user ?? member.user);
    }
}

export default setGuildMemberAddEvent;