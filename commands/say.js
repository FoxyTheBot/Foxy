const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  const sayMessage = args.join(' ');
  let say = new Discord.MessageEmbed()
  message.channel.send(sayMessage)
};