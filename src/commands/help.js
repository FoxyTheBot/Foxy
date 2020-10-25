const Discord = require('discord.js')

exports.run = async (client, message) => {

  let help = new Discord.MessageEmbed()
  .setColor('#4169E1')
  .setTitle('Olá! Eu sou a Foxy!')
  .setDescription(`Olá! ${message.author.username}, Meu prefixo é f!`)
  .setThumbnail('https://cdn.discordapp.com/avatars/737044809650274325/64b92e7d5e7fb48e977e1f04ef13369d.png?size=1024')
  .addField(`<:DiscordStaff:731947814246154240> Lista de comandos:`, `digite f!commands ou f!comandos`)
  .addField(`<:DiscordDeveloper:731945244983034033> Está com dúvidas? Meu servidor de suporte`, `https://discord.gg/54eBJcv`)
  .addField(`<:info:718944993741373511> Termos de uso`, `https://foxydiscordbot.wixsite.com/foxybot/termos-de-uso`)
  .addField(`<:ApoiadorDoDiscord:731946134720741377> Meu WebSite onde você pode me adicionar`, `https://foxydiscordbot.wixsite.com/foxybot`)
  await message.channel.send(help)
}