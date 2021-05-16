const Discord = require('discord.js');

module.exports = {
  name: 'dance',
  aliases: ['dance', 'dançar'],
  cooldown: 3,
  guildOnly: false,
  clientPerms: ['ATTACH_FILES', 'EMBED_LINKS'],

  async run(client, message, args) {
    const user = message.mentions.users.first();
    const sayMessage = args.join(' ');

    const list = [
      'https://cdn.zerotwo.dev/DANCE/62ce61da-ed7c-4a85-b05c-bdea0ec30b29.gif',
      'https://cdn.zerotwo.dev/DANCE/d2178bd6-e3ff-44cf-94e7-a1d98b5f1d47.gif',
      'https://cdn.zerotwo.dev/DANCE/0a95dde7-7cd3-4624-a871-9b4d56bdede4.gif',
      'https://i.pinimg.com/originals/93/c3/a6/93c3a64222249d47097d80f35eca02c4.gif',
      'https://thumbs.gfycat.com/AdeptPoshIberianmidwifetoad-small.gif',
    ];

    const rand = list[Math.floor(Math.random() * list.length)];
    if (user) {
      const avatar = message.author.displayAvatarURL({ format: 'png' });
      const embed = new Discord.MessageEmbed()
        .setColor('#06bbff')
        .setDescription(`**${message.author} está dançando com ${user}!**`)
        .setImage(rand)
        .setTimestamp()
        .setAuthor(message.author.tag, avatar);
      message.FoxyReply(embed);
    } else {
      const avatar = message.author.displayAvatarURL({ format: 'png' });
      const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`**${message.author} está dançando**${sayMessage}`)
        .setImage(rand)
        .setTimestamp()
        .setAuthor(message.author.tag, avatar);
      await message.FoxyReply(embed);
    }
  },

};
