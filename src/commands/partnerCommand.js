const Discord = require('discord.js')

module.exports = {
        name: "partner",
        aliases: ['partner', 'parceiro'],
        cooldown: 3,
guildOnly: false,
    async execute(client, message, args) {
    
    let results = ["https://discord.gg/nHVqcxrFmg", "https://discord.gg/KZmuFFQzQV"]
    let result = Math.floor((Math.random() * results.length)); {}

    message.channel.send(results[result])

}
}