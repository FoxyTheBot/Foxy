const Discord = require('discord.js')

exports.run = async (client, message) => {

let embed = new Discord.MessageEmbed()
.setColor('RED')
.setTitle('Eventos de mensagens')
.setDescription('Tente dizer \n What Does The Fox Say? ou Te amo Foxy')
await message.channel.send(embed)
}