const Discord = require('discord.js')

module.exports.run = async (client, message, args) => {

    if(message.author.id != "708493555768885338") return message.channel.send(`<:Error:718944903886930013> | ${message.author} Apenas pessoas especiais podem usar este comando :3 \n Sua ID: ${message.author.id} não foi encontrada nos meus arquivos.`)

    let embed = new Discord.MessageEmbed() 
    .setColor(`#4cd8b2`) 
    .setTitle(`<:DiscordStaff:731947814246154240> Painel do Desenvolvedor Foxy <:DiscordStaff:731947814246154240>`) 
    .setThumbnail(`https://cdn.discordapp.com/avatars/737044809650274325/64b92e7d5e7fb48e977e1f04ef13369d.png?size=1024`)
    .setDescription(`<a:wumpus:728716750706835518> Servidores: ${client.guilds.cache.size} \n <a:MSNXP:717914271349997598> Usuários: ${client.users.cache.size} \n <a:CatDance:728688774967721994> Canais: ${client.channels.cache.size} \n  <a:windows95:711191736764071937> API: ${Math.round(client.ping)} `)
    .setImage("https://discord.com/assets/ef555bf639a11bd65ae3065263788bba.png")

    .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}));
 await message.channel.send(embed); 

};