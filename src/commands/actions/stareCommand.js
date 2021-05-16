const Discord = require('discord.js');

module.exports = {
  name: 'stare',
  aliases: ['stare', 'encarar'],
  cooldown: 3,
  guildOnly: true,
  clientPerms: ['ATTACH_FILES', 'EMBED_LINKS'],
  
  async run(client, message, args) {
    const list = [
      'https://media1.tenor.com/images/ad4684854b2b82d065aa5844033a79d1/tenor.gif?itemid=12003923',
      'https://media1.tenor.com/images/d7c762fc8149db58393f3d31fbddaad1/tenor.gif?itemid=17156744',
      'https://media1.tenor.com/images/128ce549554ac7da234e4ed30478b981/tenor.gif?itemid=16691647',
      'https://media1.tenor.com/images/e80668007c424cb3a972e154e2c4afb8/tenor.gif?itemid=17198388',
      'https://media.tenor.com/images/4e879a98b2c39e33a4fc5bb9957a44de/tenor.gif',
      'https://media1.tenor.com/images/6db16173c29293e2c0f63db13601a85d/tenor.gif?itemid=15313333',
    ];

    const rand = list[Math.floor(Math.random() * list.length)];
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) {
      return message.FoxyReply('lembre-se de mencionar um usuário válido para encarar');
    }

    const avatar = message.author.displayAvatarURL({ format: 'png' });
    const embed = new Discord.MessageEmbed()
      .setColor('#000000')
      .setDescription(`${message.author} está encarando ${user}`)
      .setImage(rand)
      .setTimestamp()
      .setAuthor(message.author.tag, avatar);
    await message.FoxyReply(embed);
  },

};
