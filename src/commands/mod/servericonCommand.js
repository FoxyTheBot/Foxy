const Discord = require('discord.js');

module.exports = {
  name: 'servericon',
  aliases: ['servericon'],
  cooldown: 5,
  guildOnly: true,
  clientPerms: ['ATTACH_FILES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY'],

  async run(client, message) {
    const icon = message.guild.iconURL({ dynamic: true, format: 'png', size: 1024 });
    const embed = new Discord.MessageEmbed();
      embed.setColor('RED');
      embed.setTitle(`Icone de ${message.guild.name}`);
      embed.setImage(icon);
    message.reply(embed);
  },
};
