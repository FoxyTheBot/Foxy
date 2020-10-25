const Discord = require('discord.js')

exports.run = async (bot, msg, args) => {
    var membro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0])
        if(!msg.member.permissions.has("ADMINISTRATOR")) {
        return msg.reply('Você precisa ter a permissão de administrador ativa!')
    }
   if(!membro) return msg.reply(`Coloque o id do usuário que você quer enviar a mensagem ou o mencione!`)
   
    let canal = bot.users.cache.get(membro.id)
    
    var fala = args.slice(1).join(" ");
    if(!fala) return msg.reply(`Coloque o que vc vai falar`)


    msg.channel.send(`A mensagem foi enviada com sucesso!`)
    const embed = new Discord.MessageEmbed()
    .setTitle(`${msg.author.username} enviou uma mensagem pra você`)
    .setDescription(fala)
     .setTimestamp()
    .setFooter(`ID do remetente: ${msg.author.id}`)
    .setThumbnail(msg.author.displayAvatarURL(({dynamic: true}, {size: 4096})))
    .setColor("RANDOM")
    canal.send(`Servidor: ${msg.guild.name}\nRemetente: ${msg.author.tag}`,embed)
    

}
/*
bot.on('message', msg => {
    let DMs = bot.users.cache.get("633764019559202836")
    if(msg.content === "tesssst") {
        DMs.send(`testando`)
    }
})
*/

exports.help = {
    name: "dm"
}