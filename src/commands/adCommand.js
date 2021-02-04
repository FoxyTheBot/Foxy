const Discord = require('discord.js')

module.exports = { 
    name: "ad",
    aliases: ['ad', 'anúncio', 'adv'],
    cooldown: 5,
    guildOnly: true,
  async execute(client, message, args) {
     
    if(!message.member.permissions.has("ADMINSTRATOR"))return message.channel.send("<:nao:749403722488217610> Somente adms")
  
  message.channel.send("Onde você quer enviar a mensagem?").then(msg1 => {
    let canal = message.channel.createMessageCollector(c => c.author.id === message.author.id, {max: 1})
      .on('collect', c => {
        let channel = c.mentions.channels.first()
          if(!channel) {
            
            message.channel.send("Mencione um canal!")
        
          } else {
            
            message.channel.send("Qual o titulo você quer para este anúncio?").then(msg2 => {
              let titulo = message.channel.createMessageCollector(t => t.author.id === message.author.id, {max: 1})
                .on('collect', t => {
                  let title = t.content
                  
                  
            message.channel.send("Qual a descrição deste anúncio?").then(msg3 => {
              let descrição = message.channel.createMessageCollector(d => d.author.id === message.author.id, {max: 1})
                .on('collect', d => {
                  let desc = d.content
                  
                  let anunciar = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle(title)
                    .setDescription(desc)
                    .setFooter("Anúncio feito por: "+message.author.username, message.author.displayAvatarURL({size: 32}))
                  
                client.channels.cache.get(channel.id).send(anunciar)  
                  
                  message.channel.send("Anúncio enviado ao canal <#"+channel.id+"> com sucesso!")
                  
             })
            })      
           })
          })
         }
       })  
      })

}
}
