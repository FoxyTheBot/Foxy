module.exports = async (client, guild) => {
    const Discord = require('discord.js')
    const { guildsWebhook } = require('../../config.json');
    const webhookClient = new Discord.WebhookClient(guildsWebhook.id, guildsWebhook.token);

    webhookClient.send(`<:sad_cat_thumbs_up:768291053765525525> **|** Fui removida do servidor **${guild.name}**`)

}