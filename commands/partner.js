const Discord = require('discord.js')
const config = require('../config.json')

module.exports.run = async (client, message, args) => {

    let results = ["Não consegui gerar nenhum convite parceiro.", "https://discord.gg/7xpYptv"]
    let result = Math.floor((Math.random() * results.length)); {}

    message.channel.send(results[result])}
