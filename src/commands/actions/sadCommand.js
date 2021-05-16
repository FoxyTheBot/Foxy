const Discord = require('discord.js');

module.exports = {
  name: 'sad',
  aliases: ['sad', 'triste'],
  cooldown: 3,
  guildOnly: false,
  clientPerms: ['ATTACH_FILES', 'EMBED_LINKS'],

  async run(client, message, args) {
    const sayMessage = args.join(' ');
    const list = [
      'https://cdn.zerotwo.dev/SAD/2c2702a8-04bc-438d-9b86-d76a20a1de22.gif',
      'https://cdn.zerotwo.dev/SAD/fd316a94-f3cc-4819-89b3-5b25b61a1a91.gif',
      'https://cdn.zerotwo.dev/SAD/76f8a4cb-da99-4257-a1d9-17362a1e6086.gif',
    ];

    const rand = list[Math.floor(Math.random() * list.length)];

    const avatar = message.author.displayAvatarURL({ format: 'png' });
    const embed = new Discord.MessageEmbed()
      .setColor('#000000')
      .setDescription(`${message.author} está triste ${sayMessage}`)
      .setImage(rand)
      .setTimestamp()
      .setFooter(' | Gifs by: ByteAlex#1644')
      .setAuthor(message.author.tag, avatar);
    await message.FoxyReply(embed);
  },

};
