import { bot } from "..";

module.exports = async (_, guild) => {
    const guildId = guild.id;
    await bot.database.addGuild(guildId);
}