const Discord = require('discord.js')

exports.run = async (client, message) => {
  message.delete().catch(O_o => {});
  message.channel.send('Comando alternado para `f!status`')
}