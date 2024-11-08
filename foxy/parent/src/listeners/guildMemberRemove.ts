import { Bot, User } from "discordeno";
import { bot } from "../FoxyLauncher"
import WelcomerManager from "../utils/modules/WelcomerManager";

const handleWelcomerModule = new WelcomerManager();

const setGuildMemberRemoveEvent = async (_: Bot, user: User, guildId: bigint): Promise<void> => {
    const guildData = await bot.database.getGuild(guildId);

    if (guildData.GuildJoinLeaveModule.alertWhenUserLeaves) {
        handleWelcomerModule.byeMember(guildId.toString(), user);
    }
}

export default setGuildMemberRemoveEvent;