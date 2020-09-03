const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  const sayMessage = args.join(' ');
  message.delete().catch(O_o => {});
  let embed = new Discord.MessageEmbed()
  .setColor('RANDOM')
  .setDescription(sayMessage)
  message.channel.send(embed)
};