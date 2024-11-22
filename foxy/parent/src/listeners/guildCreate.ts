import { Bot, Guild } from "discordeno";
import { bot } from "../FoxyLauncher";
import { logger } from "../../../../common/utils/logger";

const setGuildCreateEvent = async (_: Bot, guild: Guild): Promise<void> => {
    const guildData = await bot.database.getGuild(guild.id);

    if (!guildData) {
        logger.info(`[GUILD_CREATE] I've been added to guild: ${guild.name} (${guild.id})`);
        await bot.database.createGuild(String(guild.id));
    }
};


export { setGuildCreateEvent }