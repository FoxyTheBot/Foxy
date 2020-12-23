const Discord = require('discord.js')

exports.run = async (client, message) => {
     message.delete().catch(O_o => {});
    let dst = new Discord.MessageEmbed()
    .setColor('GREEN')
.setTitle('Status do Discord')
.setDescription('Status do Discord: https://discordstatus.com/')
    await message.channel.send(dst)
}