const Discord = require('discord.js')
const config = require('../config.json')

module.exports.run = async (client, message, args) => {
  message.delete().catch(O_o => {});
    message.channel.send("comando excluido");
  };