const Discord = require('discord.js')

exports.run = async (client, message) => {
    let reports = new Discord.MessageEmbed()
    .setColor('RED')
.setTitle('Como reportar no Discord')
.setDescription('Para reportar no Discord acesse https://dis.gd/request')
    await message.channel.send(reports)
    }