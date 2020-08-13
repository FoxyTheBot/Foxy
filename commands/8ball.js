const Discord = require('discord.js')
const config = require('../config.json')

module.exports.run = async (client, message, args) => {
    let results = ["Sim", "Não", "Talvez", "Com certeza!"]
    let result = Math.floor((Math.random() * results.length));

    message.channel.send(results[result])
}

module.exports.config = {
    name: "8ball",
    usage: "f!8ball <Pergunta>"
}