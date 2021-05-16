module.exports = {
  name: 'ponpon',
  aliases: ['ponpon', 'pon', 'ponponpon'],
  cooldown: 5,
  guildOnly: true,
  clientPerms: ['ATTACH_FILES', 'EMBED_LINKS'],

  async run(client, message, args) {
    const { MessageEmbed } = require('discord.js');
    const ponpon = [
      'https://cdn.discordapp.com/attachments/776930851753426945/809837318331695165/tenor.gif',
      'https://cdn.discordapp.com/attachments/776930851753426945/809837318331695165/tenor.gif',
      'https://cdn.discordapp.com/attachments/776930851753426945/809837318331695165/tenor.gif',
    ];
    const rand = ponpon[Math.floor(Math.random() * ponpon.length)];

    const embed = new MessageEmbed()

      .setColor('006cb7')
      .setTitle('PONPONPON :3')
      .setURL('https://www.youtube.com/watch?v=yzC4hFK5P3g')
      .setDescription(`${message.author} **Está dançando ponpon**`)
      .setImage(rand);

    message.FoxyReply(embed);
  },
};
