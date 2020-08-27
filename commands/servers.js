const Discord = require('discord.js')

module.exports.run = async(client, message, channel) => {
    const embed = new Discord.MessageEmbed()
    message
    .setTitle("Servidores e membros")
    .setDescription(`<a:MSNXP:717914271349997598> ${client.guilds.cache.size} Servidores \n <a:DRFrog:728716839601045524> ${client.users.cache.size} Membros `)
    await message.channel.send(embed)
}