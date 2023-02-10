import { bot } from "..";
import config from "../../config.json";
import { createEmbed } from "../utils/discord/Embed";

const GuildDeleteEvent = (): void => {
    bot.events.guildDelete = async (_) => {
        const embed = createEmbed({
            title: `${bot.emotes.error} | Fui removida de um servidor! :c`,
            thumbnail: {
                "url": "https://cdn.discordapp.com/attachments/791449801735667713/791450113649410078/tenor.gif"
            },
        })
        bot.helpers.sendWebhookMessage(config.webhooks.guilds.id, config.webhooks.guilds.token, {
            embeds: [embed]
        })
    };
}

export { GuildDeleteEvent };