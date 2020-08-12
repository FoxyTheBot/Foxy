const Discord = require('discord.js')
const fs = require('fs');
const config = require('../config.json');

module.exports.run = async (client, message, args, guild) => {
  
  let userid = message.mentions.users.first().id
  if(!userid) return message.reply('error?')
  
  // Unban a user by ID (or with a user/guild member object)
guild.unban(userid)
  .then(user => message.channel.send(`Usuário ${user.username} Foi desbanido do ${guild}`))
  .catch(console.error);
}
module.exports.help = {
  "name": "unban"
}