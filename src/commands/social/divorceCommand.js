const db = require('quick.db')
const { MessageButton } = require('discord-buttons')
module.exports = {
    name: "divorce",
    aliases: ['divorce', 'divorciar'],
    cooldown: 5,
    guildOnly: true,
    clientPerms: ['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'],

    async run(client, message, args) {

        const user2 = await db.fetch(`married_${message.author.id}`)
        if (user2 == null) return message.foxyReply(`${client.emotes.broken} Você não está casadx!`);
        const user = await client.users.fetch(user2)
        if (user2 !== user.id) return message.foxyReply(`${user.id} Não está casadx com ${user.username}`)

        const butaum = new MessageButton()
            .setLabel('Divorciar')
            .setStyle("red")
            .setEmoji('💔')
            .setID('broken_heart')

        const request = await message.channel.send(`${client.emotes.broken} **|** Então é o fim? Você quer realmente se divorciar de **${user.username}**?`, butaum);

        const filter = (button) => button.clicker.user.id === message.author.id;
        const collector = request.createButtonCollector(filter, { time: 60000 })

        collector.on('collect', () => {
            message.foxyReply(`${client.emotes.broken} **|** ${message.author} ...Então é isso, se divorciar é sim uma coisa triste, Da próxima vez ame alguém que realmente mereça e respeite você, sim isso parece ser difícil pois o amor é algo cego e incontrolável... Mas é melhor estar sozinho do que mal acompanhado, eu confio em você! :heart:`)

            db.delete(`married_${message.author.id}`)
            db.delete(`married_${user.id}`)
        })

    }
}

