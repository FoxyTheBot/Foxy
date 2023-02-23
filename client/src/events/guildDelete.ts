import { bot } from "..";
import config from "../../config.json";
import { createEmbed } from "../utils/discord/Embed";

module.exports = async (guild: any) => {
    const embed = createEmbed({
        title: `${bot.emotes.FOXY_CRY} | Fui removida de um servidor! :c`,
        thumbnail: {
            "url": "https://cdn.discordapp.com/attachments/791449801735667713/791450113649410078/tenor.gif"
        },
    })
    bot.helpers.sendWebhookMessage(config.webhooks.guilds.id, config.webhooks.guilds.token, {
        embeds: [embed]
    })

};