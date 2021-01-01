const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  
  message.channel.send("Este comando foi removido!");
}

module.exports.help = { 
	name: 'die',
	aliases: ["die"]
  }