module.exports = async (client, guild) => {
  const Discord = require('discord.js');
  const { guildsWebhook } = require('../../config.json');
  const webhookClient = new Discord.WebhookClient(guildsWebhook.id, guildsWebhook.token);

  webhookClient.send(`<:meow_blush:768292358458179595> **|** Fui adicionada no servidor \`${guild.name}\``);


}