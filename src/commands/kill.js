const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
     message.delete().catch(O_o => {});
  let say = new Discord.MessageEmbed()
  .setColor('RED')
  .setTitle('Ops! Algo deu errado aqui!')
  .setDescription('Este comando não existe. Digite f!commands para ver a lista de comandos')
  .setThumbnail('https://cdn.discordapp.com/attachments/766414535396425739/769241451371692072/PngItem_1646925.png')
  await message.channel.send(say)
};