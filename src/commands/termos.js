const Discord = require('discord.js')

exports.run = async (client, message) => {
    let termos = new Discord.MessageEmbed()
    .setColor('BLUE')
    .setTitle('Termos de Uso')
    .setDescription('Leia meus termos clicando [aqui](http://foxywebsite.ml/tos.html)')
    await message.channel.send(termos)
}