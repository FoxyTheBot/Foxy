const Discord = require('discord.js');

module.exports = {
  name: 'servericon',
  aliases: ['servericon'],
  cooldown: 5,
  guildOnly: true,
  clientPerms: ['ATTACH_FILES', 'EMBED_LINKS'],
  
  async run(client, message) {
    const icon = message.guild.iconURL({ dynamic: true, format: 'png', size: 1024 });
    const embed = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle(`Icone de ${message.guild.name}`)
      .setImage(icon);
    message.FoxyReply(embed);
  },
};
