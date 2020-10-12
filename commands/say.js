<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 29acc2112f1f1b022c2e185e1f27f7123ef33f38
const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  const sayMessage = args.join(' ');
  let say = new Discord.MessageEmbed()
<<<<<<< HEAD
  message.channel.send(sayMessage)
=======
  .setColor('RANDOM')
  .setDescription(sayMessage)
  .setFooter(`Executado por: ${message.author.username}`)
  await message.channel.send(say)
=======
const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  const sayMessage = args.join(' ');
  let say = new Discord.MessageEmbed()
  .setColor('RANDOM')
  .setDescription(sayMessage)
  .setFooter(`Executado por: ${message.author.username}`)
  await message.channel.send(say)
>>>>>>> 4849578b0c5c2f2bc00528e9d14395b0384702c6
>>>>>>> 29acc2112f1f1b022c2e185e1f27f7123ef33f38
};