<<<<<<< HEAD
const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  const sayMessage = args.join(' ');
  message.delete().catch(O_o => {});
  let embed = new Discord.MessageEmbed()
  .setColor('RANDOM')
  .setDescription(sayMessage)
  message.channel.send(embed)
=======
const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  const sayMessage = args.join(' ');
  message.delete().catch(O_o => {});
  let embed = new Discord.MessageEmbed()
  .setColor('RANDOM')
  .setDescription(sayMessage)
  message.channel.send(embed)
>>>>>>> 4849578b0c5c2f2bc00528e9d14395b0384702c6
};