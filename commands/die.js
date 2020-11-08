const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  message.delete().catch(O_o => {});
  message.channel.send("Este comando foi removido!");
}