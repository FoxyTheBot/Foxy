const Discord = require('discord.js')
const config = require('../')

module.exports.run = async (client, message, args) => {
    
    let results = ["https://discord.gg/nHVqcxrFmg", "https://discord.gg/KZmuFFQzQV"]
    let result = Math.floor((Math.random() * results.length)); {}

    message.channel.send(results[result])
}
module.exports.help = {
    name: "partner",
  aliases: ["part"]
  }
