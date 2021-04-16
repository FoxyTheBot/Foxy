const Discord = require('discord.js');

module.exports = {
  name: 'termos',
  aliases: ['termos', 'terms', 'tos'],
  cooldown: 3,
  guildOnly: false,
  async run(client, message) {
    const termos = new Discord.MessageEmbed()
      .setTitle('Termos de Uso')
      .setDescription('Você pode ler os termos de uso clicando [aqui](http://foxywebsite.ml/tos.html)');
    await message.FoxyReply(termos);
  },
};
