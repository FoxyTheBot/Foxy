const Discord = require('discord.js')

exports.run = async (client, message) => {

  message.delete().catch(O_o => {});
  
  
  let totalSeconds = client.uptime / 1000;
  let days = Math.floor(totalSeconds / 86400);
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  let uptime = `${days.toFixed()}d ${hours.toFixed()}h ${minutes.toFixed()}m ${seconds.toFixed()}s`;


  let botinfo = new Discord.MessageEmbed()
  .setColor('RANDOM')
  .setTitle('Olá! Eu me chamo Foxy')
  .setThumbnail('https://cdn.discordapp.com/avatars/737044809650274325/64b92e7d5e7fb48e977e1f04ef13369d.png?size=1024')
  .setDescription(`Olá, eu sou a Foxy, tenho 15 anos \n Atualmente estou espalhando alegria em **${client.guilds.cache.size}** servidores, com **${client.users.cache.size}** amiguinhos :heart:! \n Faz **${uptime}** que eu acordei desde 26 de Julho de 2020 \n\n Eu fui criada em <:js:770029787644821515> JavaScript utilizando a Discord.js e se você quiser ver como fui desenvolvida acesse https://github.com/WinG4mer/FoxyBot \n\n  :medal: **Pessoas Incriveis** \n • **WinGamer#4285** | Se não fosse ele, eu nem iria existir \n • **! Arthur#7264** | Por me ajudar a ficar online! :heart: \n • **Bis❄#0001** | Por me desenhar :heart: \n • **ThierrY#6303** | Por me ajudar a crescer :heart: \n • Todas as **${client.users.cache.size}** pessoas que me usam, amo vocês <:cat_heart_eyes:770028439863820308> \n • E você ${message.author} que está falando comigo`)
  .setFooter(`Foxy foi criada por WinGamer#4285`)
  await message.channel.send(botinfo)
}