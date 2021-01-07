const Discord = require('discord.js')
module.exports.run = async (client, message, args) => {
     
  const ajuda = new Discord.MessageEmbed()
  .setColor('BLUE')
  .setDescription(`<:ping:749403780998758520> **| Pong!**\n <a:ping2:754144264161591336> Latência da API: **${Math.round(
  client.ws.ping
)}ms**`)
  
await message.channel.send(ajuda)
} 
