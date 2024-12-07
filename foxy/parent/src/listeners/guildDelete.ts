import { Bot } from "discordeno";
import { bot } from "../FoxyLauncher";
import { logger } from "../../../../common/utils/logger";

const setGuildDeleteEvent = async (_: Bot, guild: bigint): Promise<void> => {
    const guildData = bot.database.getGuild(guild);

    if (guildData) {
        logger.info(`[GUILD_DELETE] I've been removed from guild: ${guild}`);
        await bot.database.removeGuild(guild);

        setTimeout(async () => {
            bot.helpers.sendWebhookMessage(process.env.LEAVE_GUILD_WEBHOOK_ID, process.env.LEAVE_GUILD_WEBHOOK_TOKEN, {
                embeds: [{
                    title: `<:emoji:${bot.emotes.FOXY_CRY}> **|** Servidor removido!`,
                    fields: [{
                        name: "ID",
                        value: guild.toString(),
                        inline: true
                    }]
                }]
            });
        }, 1000);
    }
}

export { setGuildDeleteEvent }