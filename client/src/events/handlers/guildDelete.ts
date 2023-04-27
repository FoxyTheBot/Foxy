import { bot } from "../../";

const setGuildDeleteEvent = (): void => {
    bot.events.guildDelete = async (_, guild) => {
        const guildId = guild;
        await bot.database.removeGuild(guildId);
    }
}

export { setGuildDeleteEvent }