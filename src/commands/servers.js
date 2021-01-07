const Discord = require('discord.js')

module.exports.run = async(client, message, channel) => {
 
    message.channel.send(`Em ${client.guilds.cache.size} servidores`)
}