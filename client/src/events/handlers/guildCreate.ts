import { bot } from "../../";

const setGuildCreateEvent = (): void => {
    bot.events.guildCreate = async (_, guild) => {
        const guildId = guild.id;
        await bot.database.addGuild(guildId);
    }
}

export { setGuildCreateEvent }