const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
  if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Você não tem permissão para executar esse comando!")
  
  let totalSeconds = (client.uptime / 1000);
let days = Math.floor(totalSeconds / 86400);
let hours = Math.floor(totalSeconds / 3600);
totalSeconds %= 3600;
let minutes = Math.floor(totalSeconds / 60);
let seconds = totalSeconds % 60;
  
let embed = new Discord.MessageEmbed() 
.setColor(`RANDOM`) 
.setTitle(`Tempo de atividade`) 
.setDescription(`Faz ${days} dias, ${hours} Horas, ${minutes} e ${seconds} segundos.`)

.setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}));
await message.channel.send(embed); 
  
  message.delete().catch(O_o => {});

    }

module.exports.help = {
  "name": "uptime"
}