const Discord = require('discord.js')

exports.run = async (client, message) => {
    let termos = new Discord.MessageEmbed()
    .setTitle('Termos de Uso')
    .setDescription('Você pode ler os termos de uso clicando [aqui](http://foxywebsite.ml/tos.html)')
    await message.channel.send(termos)
}