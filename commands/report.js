const Discord = require('discord.js')

exports.run = async (channel, message) => {
    let report = new Discord.MessageEmbed()
    .setTitle('<a:discord_clyde:750940164284743712> Envie uma sugestão, dúvida ou um bug no servidor do Foxy')
    .setThumbnail('https://cdn.discordapp.com/attachments/743575775046926447/751181572367188128/DiscordStaff.png')
    .setDescription('Como Fazer: \n 1- Entre no servidor \n 2- vá em qualquer canal \n 3- digite sua sugestão, dúvida ou bug \n 4- e marque o cargo `Foxy Team` \n 5- Link: https://discord.gg/54eBJcv')
    
    message.channel.send(report)
};