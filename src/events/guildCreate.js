module.exports = async (client, guild) => {
  const Discord = require('discord.js');
  const { guildsWebhook } = require('../../config.json');
  const webhookClient = new Discord.WebhookClient(guildsWebhook.id, guildsWebhook.token);

  webhookClient.send(`<:MeowPuffyMelt:776252845493977088> **|** Fui adicionada no servidor \`${guild.name}\``);
};
