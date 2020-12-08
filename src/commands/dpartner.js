const Discord = require('discord.js')

exports.run = async (client, message) => {
    let partner = new Discord.MessageEmbed()
    .setColor('#7289DA')
.setTitle('Discord Partner')
.setDescription('Para ver se seu servidor atende os requisitos de parceria \n Configurações do servidor > Programa de parceria ou Partner Program \n depois acesse https://discord.com/partners')
    await message.channel.send(partner)
}