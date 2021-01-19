const Discord = require('discord.js')

module.exports = {
name: "tf",
aliases: ['tf'],
cooldown: 3,
guildOnly: false,
async execute(client, message, args) {
    let results = ["Verdade", "Falso"]
    let result = Math.floor((Math.random() * results.length)); {}

    message.channel.send(results[result])

}
}