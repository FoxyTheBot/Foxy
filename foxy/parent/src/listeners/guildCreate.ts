import { Bot, Guild } from "discordeno";
import { bot } from "../FoxyLauncher";
import { logger } from "../../../../common/utils/logger";

const setGuildCreateEvent = async (_: Bot, guild: Guild): Promise<void> => {
    const guildData = await bot.database.getGuild(guild.id);

    if (guildData.isNew) {
        guildData.isNew = false;
        logger.info(`[GUILD_CREATE] Joined a new guild: ${guild.name} (${guild.id})`);
    }
};


export { setGuildCreateEvent }