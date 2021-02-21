const Discord = require('discord.js')

module.exports = {
name: "tf",
aliases: ['tf'],
cooldown: 3,
guildOnly: false,
argsRequire: true,
async execute(client, message, args) {
    if(!args) {
    message.channel.send("Digite uma pergunta")
    } else {
        let results = ["Verdade", "Falso"]
        let result = Math.floor((Math.random() * results.length));
        {
        }

        message.channel.send(results[result])
    }
}
}