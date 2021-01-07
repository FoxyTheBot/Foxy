const Discord = require('discord.js')

module.exports.run = async (client, message, args) => {
    let results = ["Verdade", "Falso"]
    let result = Math.floor((Math.random() * results.length)); {}

    message.channel.send(results[result])}