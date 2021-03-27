module.exports = async (client, guild) => {
  const Discord = require('discord.js');
  const { guilds } = require('../config/config.json');
  const webhookClient = new Discord.WebhookClient(guilds.id, guilds.token);
  if (guild.name.includes('@')) {
    return webhookClient.send(`<:sad_cat_thumbs_up:768291053765525525> **|** Fui removida do servidor \`${guild.id}\``);
  }

  webhookClient.send(`<:sad_cat_thumbs_up:768291053765525525> **|** Fui removida do servidor \`${guild.name}\``);
};
