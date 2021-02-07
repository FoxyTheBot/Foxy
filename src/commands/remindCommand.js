module.exports = {
    name: "remind",
    aliases: ['remind', 'lembrar', 'lembrete'],
    guildOnly: true,
    cooldown: 5,

    async execute(client, message, args) {
        const Discord = require("discord.js")
        const db = require('quick.db')
        const ms = require('ms')
        let reason = args.slice(1).join(" ")

        let timeuser = args[0]
              const example = new Discord.MessageEmbed()
              .setColor('RED')
              .setTitle('Como usar :thinking:')
              .addFields(
                  { name: ":bell: Exemplo:", value: "`f!remind 10s Atualizar o Windows`"}
              )
        if(!timeuser) return message.channel.send(example)
        if(!reason) return message.channel.send(':no_bell: Você precisa digitar o lembrete')
      
        db.set(`remind_${message.author.id}`, Date.now() + ms(timeuser))
     
        message.channel.send(`:bell: **|** Ok! Eu irei te lembrar de \`${reason}\` em \`${timeuser}\``)
        const interval = setInterval(function() {
            if(Date.now() > db.fetch(`remind_${message.author.id}`)){
                db.delete(`remind_${message.author.id}`)
                message.channel.send(`:bell: **|** Hey ${message.author}! Lembrete: \`${reason}\``)
                .catch(e => console.log(e))
                clearInterval(interval)
            }
        }, 1000)
    }
}