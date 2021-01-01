const Discord = require('discord.js');
const config = require('../');

module.exports.run = async (client, message, args) => {
    
    const webhookClient = new Discord.WebhookClient('WEBHOOK-ID', "WEBHOOK-TOKEN");
    const sayMessage = args.join(' ');
    const noargs = new Discord.MessageEmbed()
        .setColor('BLUE')
        .setTitle('Como usar')
        .setDescription('<:meowbughunter:776249240463736834> **Reporte falhas para meu servidor de suporte** \n 💁‍♀️ **Exemplo:** `f!report bot retorna undefined`')

    if (!sayMessage) return message.channel.send(noargs)
    message.channel.send(`Obrigada por me ajudar ${message.author}, seu report foi enviado com sucesso!`)
    const embed = new Discord.MessageEmbed()
        .setTitle(`<:meowbughunter:776249240463736834> | Report para Foxy`)
        .setColor('#0099ff')
        .setDescription(`Autor: **${message.author.username} / ${message.author.id}** \n Servidor: ${message.guild.name} \n ${message.guild.id} \n\n **Issue:** ${sayMessage}`)

    webhookClient.send( {
        username: `${message.author.username}`,
        avatarURL: 'https://cdn.discordapp.com/attachments/766414535396425739/789255465125150732/sad.jpeg',
        embeds: [embed],
    });
}

module.exports.help = {
    name: "report",
  aliases: ["report", "reportar"]
  }