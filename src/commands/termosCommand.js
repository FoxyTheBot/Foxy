const Discord = require('discord.js')

module.exports = {
        name: "terms",
        aliases: ['termos', 'terms', 'tos'],
        cooldown: 3,
        guildOnly: false,
    async execute(client, message) {
    let termos = new Discord.MessageEmbed()
    .setTitle('Termos de Uso')
    .setDescription('Você pode ler os termos de uso clicando [aqui](http://foxywebsite.ml/tos.html)')
    await message.channel.send(termos)
}
}