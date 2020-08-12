const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
  
if(message.author.id != "708493555768885338") return message.channel.send("Desculpa, Mas só meu dono pode usar esse comando!")
  message.channel.send(`WinGamer eu estou em ${client.guilds.cache.size} Servidores ${client.users.cache.size} Membros`)
  message.channel.send(client.guilds.map(g=>g.name).join('\n'))
  }


module.exports.help = {
  name: "servers"
}