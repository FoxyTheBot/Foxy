const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  const sayMessage = args.join(' ');
  message.channel.send(`${sayMessage} - ${message.author}`)
  console.log(`The user ${message.author.tag} ID: ${message.author.id} say ${sayMessage} using say command`)
};