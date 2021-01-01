const Discord = require('discord.js')
const os = require('os')
module.exports.run = async (client, message) => {
      
  
    let cpu = Math.round(process.cpuUsage().system / 1024 / 1024).toString()
    if(cpu < 1) {
        cpu = (process.cpuUsage().system / 1024 / 1024).toFixed()
    }
    let ram = Math.round(process.memoryUsage().rss / 1024 / 1024).toString()
    let modelo = os.cpus().map((i) => `${i.model}`)[0]
  
  let totalSeconds = client.uptime / 1000;
  let days = Math.floor(totalSeconds / 86400);
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  let uptime = `${days.toFixed()}d ${hours.toFixed()}h ${minutes.toFixed()}m ${seconds.toFixed()}s`;
 
  const ajuda = new Discord.MessageEmbed()
  
  .setColor('BLUE')
  .setTitle('Olá! Eu me chamo Foxy')
  .setThumbnail('https://cdn.discordapp.com/avatars/737044809650274325/64b92e7d5e7fb48e977e1f04ef13369d.png?size=1024')
  .setDescription(`Olá, eu sou a Foxy, tenho 15 anos \n Atualmente estou espalhando alegria em **${client.guilds.cache.size}** servidores :heart:! \n Faz **${uptime}** que eu acordei desde 26 de Julho de 2020 \n\n Eu fui criada em JavaScript utilizando a Discord.js e se você quiser ver como fui desenvolvida acesse https://github.com/BotFoxy/FoxyBot \n\n  :medal: **Pessoas Incriveis** \n • **WinG4merBR#5995** | Se não fosse ele, eu nem iria existir \n • **! Arthur#7264** | Por me ajudar a ficar online! :heart: \n • **Bis❄#0001** | Por me desenhar :heart: \n • **ThierrY#6303** | Por me ajudar a crescer :heart: \n • Todas as **${client.users.cache.size}** pessoas que me usam, amo vocês <:cat_heart_eyes:770028439863820308> \n • E você ${message.author} que está falando comigo`)
  .setFooter(`Foxy foi criada por WinG4merBR#5995`)
  
message.channel.send(ajuda).then(msg => {
  msg.react('📚').then(r => {

})
  
  const infosFilter = (reaction, user) => reaction.emoji.name === '📚' && user.id === message.author.id;

  
  const infos = msg.createReactionCollector(infosFilter);


  infos.on('collect', r2 => {
      let status = new Discord.MessageEmbed()
      .setColor('BLUE')
      .setTitle('Status')
      .setDescription(`<:ApoiadorDoDiscord:731946134720741377> | ${message.author} \n<:catblush:768292358458179595> | **Amor:** ∞ \n<:js:769246367717261362> | **Versão do Node:** 14.x \n:computer: | **Memória Utilizada** | ${ram} MB \n:computer: | **Memória Alocada:** 512 MB \n:computer: | **Memória Total:** 18000 MB`)
    msg.edit(status)
    
  })

})
},
module.exports.help = { 
  name: 'botinfo',
  aliases: ["bi", "botinfo", "infobot"]
}