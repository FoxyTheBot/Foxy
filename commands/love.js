const Discord = require('discord.js')
const config = require('../config.json')

module.exports.run = async (client, message, args) => {
    let results = ["Seja você mesmo!", "Seja confiante!", "Veja se ele(a) é a pessoa certa!"]
    let result = Math.floor((Math.random() * results.length));

    message.channel.send(results[result])
}
