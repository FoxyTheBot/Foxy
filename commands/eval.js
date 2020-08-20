const Discord = require('discord.js')

module.exports.run = async (client, message, args) => {

    if(message.author.id != "708493555768885338") return message.channel.send("<:Error:718944903886930013> **Comando Bloqueado** <:Error:718944903886930013> \n Você não tem permissão para executar esse comando! \n Motivo: Sua ID não foi encontrada no arquivo `eval.js` ou `config.json`.")

    let totalSeconds = (client.uptime / 1000);
    let days = Math.floor(totalSeconds / 86);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
    let embed = new Discord.MessageEmbed() 
    .setColor(`#4cd8b2`) 
    .setTitle(`<:DiscordStaff:731947814246154240> Painel do Desenvolvedor Foxy <:DiscordStaff:731947814246154240>`) 
    .setDescription(`<a:wumpus:728716750706835518> Servidores: ${client.guilds.cache.size} \n <a:MSNXP:717914271349997598> Usuários: ${client.users.cache.size} \n <a:CatDance:728688774967721994> Canais: ${client.channels.cache.size} \n <a:windows10:728716821145845770> Tempo de atividade: ${days} dias ${hours} horas ${minutes} minutos e ${seconds} segundos \n <a:windows95:711191736764071937> API: ${Math.round(client.ping)} `)
    .setImage("https://discord.com/assets/ef555bf639a11bd65ae3065263788bba.png")

    .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}));
 await message.channel.send(embed); 
};