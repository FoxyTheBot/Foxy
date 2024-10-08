import { bot } from "../FoxyLauncher";

const setGuildDeleteEvent = (): void => {
    bot.events.guildDelete = async (_, guild) => {

        const guildData = bot.database.getGuild(guild);

        if (guildData) {
            await bot.database.removeGuild(guild).then((document) => {
                setTimeout(() => {
                    bot.helpers.sendWebhookMessage(process.env.JOIN_GUILD_WEBHOOK_ID, process.env.JOIN_GUILD_WEBHOOK_TOKEN, {
                        embeds: [{
                            title: `<:emoji:${bot.emotes.FOXY_CRY}> **|** Fui removida de um servidor!`,
                            description: `**ID:** ${guild}`,
                            footer: {
                                text: `Servidor removido do banco de dados!`
                            }
                        }]
                    });
                }, 500);
            })
        }

    }
}

export { setGuildDeleteEvent }