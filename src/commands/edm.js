const Discord = require('discord.js')

exports.run = async (bot, msg, args) => {
        if(msg.author.id != "708493555768885338") return msg.channel.send(`<:Error:718944903886930013> | ${message.author} <:nao:749403722488217610> Apenas pessoas especiais podem usar este comando :3 \n Sua ID: ${msg.author.id} não foi encontrada nos meus arquivos.`)
    var membro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0])
 
   if(!membro) return msg.reply(`Coloque o id do usuário que você quer enviar a mensagem ou o mencione!`)
   
    let canal = bot.users.cache.get(membro.id)
    
    var fala = args.slice(1).join(" ");
    if(!fala) return msg.reply(`Coloque o que vc vai falar`)


    msg.channel.send(`A mensagem foi enviada com sucesso!`)
    canal.send(fala)
    

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