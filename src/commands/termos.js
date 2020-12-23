const Discord = require('discord.js')

exports.run = async (client, message) => {
 message.delete().catch(O_o => {});
    let termos = new Discord.MessageEmbed()
    .setTitle('Termos de Uso')
    .setURL('https://foxydiscordbot.wixsite.com/foxybot/termos-de-uso')
    .setDescription('Leia meus termos no meu site')
    await message.channel.send(termos)
}