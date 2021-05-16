const Discord = require('discord.js');

module.exports = {
  name: 'scream',
  aliases: ['scream', 'gritar'],
  cooldown: 3,
  guildOnly: false,
  clientPerms: ['ATTACH_FILES', 'EMBED_LINKS'],

  async run(client, message, args) {
    const sayMessage = args.join(' ');
    const list = [
      'https://media1.tenor.com/images/323accb4d3c53c7202305f5f32225713/tenor.gif?itemid=11222953',
      'https://i.gifer.com/3HKT.gif',
    ];

    const rand = list[Math.floor(Math.random() * list.length)];

    const avatar = message.author.displayAvatarURL({ format: 'png' });
    const embed = new Discord.MessageEmbed()
      .setColor('#000000')
      .setDescription(`${message.author} gritou ${sayMessage}`)
      .setImage(rand)
      .setTimestamp()
      .setFooter('')
      .setAuthor(message.author.tag, avatar);
    await message.FoxyReply(embed);
  },

};
