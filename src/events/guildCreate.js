module.exports = async (client, guild) => {
  const Discord = require('discord.js');
  const { guilds } = require('../config/config.json');
  const webhookClient = new Discord.WebhookClient(guilds.id, guilds.token);
  if(guild.name.includes('@')) {
    return webhookClient.send(`<:meow_blush:768292358458179595> **|** Fui adicionada no servidor \`${guild.id}\``);
  }

  webhookClient.send(`<:meow_blush:768292358458179595> **|** Fui adicionada no servidor \`${guild.name}/${guild.id}\``);


}