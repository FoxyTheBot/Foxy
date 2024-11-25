import { Bot, getGuildIconURL, Guild } from "discordeno";
import { bot } from "../FoxyLauncher";
import { logger } from "../../../../common/utils/logger";

const setGuildCreateEvent = async (_: Bot, guild: Guild): Promise<void> => {
    const guildData = await bot.database.getGuild(guild.id);

    if (guildData.isNew) {
        guildData.isNew = false;
        logger.info(`[GUILD_CREATE] Joined a new guild: ${guild.name} (${guild.id})`);

        setTimeout(async () => {
            bot.helpers.sendWebhookMessage(process.env.JOIN_GUILD_WEBHOOK_ID, process.env.JOIN_GUILD_WEBHOOK_TOKEN, {
                embeds: [{
                    title: `<:emoji:${bot.emotes.FOXY_YAY}> **|** Novo servidor!`,
                    thumbnail: {
                        url: getGuildIconURL(bot, guild.id, guild.icon, { size: 2048 })
                    },
                    fields: [{
                        name: "Nome",
                        value: guild.name,
                    }, {
                        name: "ID",
                        value: `\`${guild.id}\``,
                    }, {
                        name: "Dono",
                        value: `<@${guild.ownerId}> (\`${guild.ownerId}\`)`,
                    }, {
                        name: "Membros",
                        value: `\`${guild.memberCount}\``,
                    }]
                }]
            });
        });
    }
};


export { setGuildCreateEvent }