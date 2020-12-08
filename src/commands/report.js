const Discord = require('discord.js')

exports.run = async (channel, message) => {
    
    message.delete().catch(O_o => {});
    
    let report = new Discord.MessageEmbed()
    .setTitle('<:meowbughunter:776249240463736834> Envie uma sugestão, dúvida ou um bug no servidor do Foxy')
    .setThumbnail('https://cdn.discordapp.com/attachments/743575775046926447/751181572367188128/DiscordStaff.png')
    .setDescription('Como Fazer: \n 1- Entre no servidor \n 2- vá em qualquer canal \n 3- digite f!ticket para criar um canal para você reportar \n 4- e marque o cargo `Guarda-Costas da Foxy` \n 5- Link: https://discord.gg/nHVqcxrFmg')
    
    message.channel.send(report)
};