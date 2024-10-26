import { bot } from "../FoxyLauncher";

const setGuildCreateEvent = (): void => {
    bot.events.guildCreate = async (_, guild) => {
        const guildData = await bot.database.getGuild(guild.id)
        if (!guildData) {
            await bot.database.addGuild(guild.id);
            setTimeout(() => {
                bot.helpers.sendWebhookMessage(process.env.JOIN_GUILD_WEBHOOK_ID, process.env.JOIN_GUILD_WEBHOOK_TOKEN, {
                    embeds: [{
                        title: `<:emoji:${bot.emotes.FOXY_YAY}> **|** Fui adicionada em um servidor!`,
                        thumbnail: {
                            url: bot.helpers.getGuildIconURL(guild.id, guild.icon)
                        },
                        fields: [{
                            name: "Nome",
                            value: guild.name
                        },
                        {
                            name: "ID",
                            value: guild.id.toString()
                        }, {
                            name: "ID do dono(a)",
                            value: guild.ownerId.toString()
                        }],
                        footer: {
                            text: `Servidor salvo no banco de dados!`
                        }
                    }]
                });
            }, 1000);
        }
    }
};


export { setGuildCreateEvent }