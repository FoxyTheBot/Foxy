const Discord = require ('discord.js')

exports.run = async (client ,message) => {


    message.channel.send(`Sua id é: ${message.author.id}`)

}