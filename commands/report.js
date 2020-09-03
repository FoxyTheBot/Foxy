const Discord = require('discord.js')

exports.run = async (channel, message) => {
    let report = new Discord.MessageEmbed()
    .setTitle('<a:discord_clyde:750940164284743712> Envie uma sugestão, dúvida ou um bug no servidor do Foxy')
    .setThumbnail('https://cdn.discordapp.com/attachments/743575775046926447/751181572367188128/DiscordStaff.png')
    .setDescription('Como Fazer: \n Entre no servidor \n vá em qualquer canal \n digite sua sugestão, dúvida ou bug \n e marque o cargo `Equipe | Foxy` \n Link: https://discord.gg/EbNy9rR')
    
    message.channel.send(report)
};