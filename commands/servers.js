<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 29acc2112f1f1b022c2e185e1f27f7123ef33f38
const Discord = require('discord.js')

module.exports.run = async(client, message, channel) => {
 message.channel.send("<:nao:749403722488217610> | Este comando foi desativado")
<<<<<<< HEAD
=======
=======
const Discord = require('discord.js')

module.exports.run = async(client, message, channel) => {
    const embed = new Discord.MessageEmbed()
    message
    .setTitle("Servidores e membros")
    .setDescription(`<a:MSNXP:717914271349997598> ${client.guilds.cache.size} Servidores \n <a:DRFrog:728716839601045524> ${client.users.cache.size} Membros `)
    await message.channel.send(embed)
>>>>>>> 4849578b0c5c2f2bc00528e9d14395b0384702c6
>>>>>>> 29acc2112f1f1b022c2e185e1f27f7123ef33f38
}