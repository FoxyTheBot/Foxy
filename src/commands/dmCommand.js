const Discord = require('discord.js')

module.exports = {
        name: "dm",
        aliases: ['dm'],
        cooldown: 5,
        guildOnly: true,
    async execute(client, message, argsbot, msg, args) {
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
    const webhookClient = new Discord.WebhookClient("WEBHOOK-ID", "WEBHOOK-TOKEN");
    const log = new Discord.MessageEmbed()
        .setTitle('Logs de comandos')
        .setDescription(`**Command:** f!dm \n **Author:** ${msg.author.tag} / ${msg.author.id} \n\n **Guild** ${msg.guild.name} / ${msg.guild.id} \n\n **Message:** ${fala} \n\n Link: [Message link](${msg.url}) \n\n Enviado para: ${membro}`)
    webhookClient.send( {
        username: `Logs`,
        avatarURL: 'https://cdn.discordapp.com/attachments/766414535396425739/789255465125150732/sad.jpeg',
        embeds: [log],
    });
}

}