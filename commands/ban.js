
const Discord = require('discord.js')
const fs = require('fs');
const config = require('../config.json');

module.exports.run = async (client, message, args) => {

    if(!message.member.hasPermission('BAN_MEMBERS')) return message.reply("você não tem permissão de `BANS_MEMBERS`")
    let member = message.mentions.members.first()

    const user = message.mentions.users.first();

    let prefix = config.prefix;  

    if(!member) return message.channel.send(`Use: ${prefix}ban <@Usuário> <Motivo>`)

        if(!member.bannable)
        return message.reply("<a:error:754144173942243378> Eu não posso banir esse usuário, ele pode ter um cargo maior que o meu.")

        let reason = args.slice(1).join(' ');

   let anuncioembed = new Discord.MessageEmbed()
   anuncioembed.setColor("ORANGE")
   anuncioembed.setDescription(`Você está presta a banir o ${user.toString()} você tem certeza?`)
   anuncioembed.setTimestamp();
   
   return message.channel.send(anuncioembed).then(async msg => {
   
        await msg.react("✅") 

       const a1 = (reaction, user) => reaction.emoji.name ==='✅' && user.id === message.author.id
       const b1 = msg.createReactionCollector(a1, { time: 3000000 });
       
       b1.on("collect", c1 => {
        msg.delete(anuncioembed)
        if(!reason) reason = "Não informado"
        member.ban(reason)

         .catch(error => message.reply(`<a:error:754144173942243378> Desculpe ${message.author} não consigo expulsar esse jogador, devido ao erro: ${error}`));

        let pEmbed = new Discord.MessageEmbed()

        .setDescription(`<:sim:749403706394411068> O jogador ${user.toString()} foi banido. Motivo: ${reason}`)
        .setFooter(`${message.author.tag}`, message.author.displayAvatarURL)
        .setColor("#498bfa").setTimestamp()
        
         msg.channel.send(pEmbed)

         const banimento = new Discord.MessageEmbed()

         .setTitle('Punição')
         .setColor('#498bfa')
         .setDescription(`Jogador punido: **${user}**\nAutor da punição: ${message.author}\nMotivo da punição: ${reason}\nTipo de punição: Banimento.`);
         let banschannel = client.channels.cache.get('741078512886087681')
         if(!banschannel) return message.channel.send(`${user} foi punido!`);
  
         message.delete().catch(O_o=>{});

         banschannel.send(banimento)
})
  b2.on("collect", c2 => {
    msg.delete(0) 
    
    })
})

}
