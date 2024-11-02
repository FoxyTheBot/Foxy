import { bot } from "../FoxyLauncher"
import WelcomerManager from "../utils/modules/WelcomerManager";

const handleWelcomerModule = new WelcomerManager();

const setGuildMemberRemoveEvent = (): void => {
    bot.events.guildMemberRemove = async (_, user, guildId) => {
        const guildData = await bot.database.getGuild(guildId);

        if (guildData.GuildJoinLeaveModule.alertWhenUserLeaves) {
            handleWelcomerModule.byeMember(guildId.toString(), user);
        }
    }
}

export default setGuildMemberRemoveEvent;