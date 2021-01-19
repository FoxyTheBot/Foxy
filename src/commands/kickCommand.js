const Discord = require('discord.js')
module.exports = {
name: "kick",
aliases: ['kick', 'expulsar'],
cooldown: 3,
guildOnly: true,
async execute(client, message, args) {
 
    if(!message.member.hasPermission('KICK_MEMBERS')) return message.reply("você não tem permissão de `KICK_MEMBERS`")
    let member = message.mentions.members.first()

    const user = message.mentions.users.first();

    let prefix = config.prefix;  

    if(!member) return message.channel.send(`Use: ${prefix}kick <@Usuário> <Motivo>`)

        if(!member.bannable)
        return message.reply("<:sad_cat_thumbs_up:768291053765525525> Eu não posso expulsar esse usuário, ele pode ter um cargo maior que o meu.")

        let reason = args.slice(1).join(' ');

   let anuncioembed = new Discord.MessageEmbed()
   anuncioembed.setColor("ORANGE")
   anuncioembed.setDescription(`Você está presta a expulsar o ${user.toString()} você tem certeza?`)
   anuncioembed.setTimestamp();
   
   return message.channel.send(anuncioembed).then(async msg => {
   
        await msg.react("✅") 

       const a1 = (reaction, user) => reaction.emoji.name ==='✅' && user.id === message.author.id
       const b1 = msg.createReactionCollector(a1, { time: 3000000 });
       
       b1.on("collect", c1 => {
        msg.delete(anuncioembed)
        if(!reason) reason = "Não informado"
        member.kick(reason)

         .catch(error => message.reply(`<a:error:754144173942243378> Desculpe ${message.author} não consigo expulsar esse jogador, devido ao erro: ${error}`));

        let pEmbed = new Discord.MessageEmbed()

        .setDescription(`<:sim:749403706394411068> O jogador ${user.toString()} foi expulso. Motivo: ${reason}`)
        .setFooter(`${message.author.tag}`, message.author.displayAvatarURL)
        .setColor("#498bfa").setTimestamp()
        
         msg.channel.send(pEmbed)

         const kick = new Discord.MessageEmbed()

         .setTitle('Punição')
         .setColor('#498bfa')
         .setDescription(`Jogador punido: **${user}**\nAutor da punição: ${message.author}\nMotivo da punição: ${reason}`);
         let kickschannel = client.channels.cache.get('741078512886087681')
         if(!kickschannel) return message.channel.send(`${user} foi punido!`);
  

         kickschannel.send(kick)
})
  b1.on("collect", c2 => {
    msg.delete(0) 
    
    })
})

}

}