const Discord = require('discord.js')

module.exports.run = async (client, message, args) => {
  const ajuda = new Discord.MessageEmbed()
  .setColor('BLUE')
  .setDescription(`<:ping:749403780998758520> **| Pong!**\n <a:ping2:754144264161591336> Latência da API: **${Math.round(
  client.ws.ping
)}ms**`)
  
message.channel.send(ajuda).then(msg => {
  msg.react('📚').then(r => {

})
  
  const infosFilter = (reaction, user) => reaction.emoji.name === '📚' && user.id === message.author.id;

  
  const infos = msg.createReactionCollector(infosFilter);


  infos.on('collect', r2 => {
      let status = new Discord.MessageEmbed()
      ajuda.setColor('BLUE')
      ajuda.setTitle('Yay! <:blobnom:776249991010189354>')
      ajuda.setDescription(`Você descobriu um easter egg! Digite f!sadcats`)
    msg.edit(ajuda)
    
  })

})
} 
