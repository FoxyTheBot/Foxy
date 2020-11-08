const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  let say = new Discord.MessageEmbed()
  .setColor('RED')
  .setTitle('Ops! Algo deu errado aqui!')
  .setDescription('Infelizmente este comando foi removido por questões de segurança')
  .setThumbnail('https://cdn.discordapp.com/attachments/766414535396425739/769241451371692072/PngItem_1646925.png')
  await message.channel.send(say)
};