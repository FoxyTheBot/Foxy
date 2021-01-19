const Discord = require("discord.js");

module.exports = {
name: "uptime",
aliases: ['uptiime'],
cooldown: 3,
guildOnly: false,
async execute(client, message, args) {
  
  
  
  let totalSeconds = client.uptime / 1000;
  let days = Math.floor(totalSeconds / 86400);
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  let uptime = ` ${days.toFixed()} dias\n ${hours.toFixed()} horas\n ${minutes.toFixed()} minutos\n ${seconds.toFixed()} segundos`;

  const embed = new Discord.MessageEmbed()
    .setTitle(`Ativo há`)
    .setThumbnail("https://cdn.discordapp.com/avatars/737044809650274325/64b92e7d5e7fb48e977e1f04ef13369d.png?size=1024")
    .setColor("BLUE")
    .setDescription(`**Estou online há:**\n${uptime}`)

  message.channel.send(embed);
}

}