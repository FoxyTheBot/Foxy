const Discord = require('discord.js');

module.exports = {
  name: 'fate',
  aliases: ['fate'],
  cooldown: 3,
  guildOnly: true,
  clientPerms: ['READ_MESSAGE_HISTORY'],
  
  async run(client, message, args) {
    const list = [
      'namorados <3',
      'amigos :)',
      'casados <3',
      'inimigos >:3',
      'irmãos :3',
      'primos :3',
      'dois maconheiros <:makonia:843151559269679164>'
    ];

    const rand = list[Math.floor(Math.random() * list.length)];
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) {
      return message.FoxyReply('lembre-se de mencionar um usuário válido');
    }
    const embed = new Discord.MessageEmbed()
      .setColor('#000000')
      .setTitle('Em outro universo paralelo 🌀')
      .setDescription(`${message.author} e ${user} são ${rand}`)
      .setTimestamp()
      .setFooter('');
    await message.FoxyReply(embed);
  },

};
