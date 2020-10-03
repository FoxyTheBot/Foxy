const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  const sayMessage = args.join(' ');
  let say = new Discord.MessageEmbed()
  .setColor('RANDOM')
  .setDescription(sayMessage)
  .setFooter(`Executado por: ${message.author.username}`)
  await message.channel.send(say)
};