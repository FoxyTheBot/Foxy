module.exports = {
    name: "divorce",
    aliases: ['divorce', 'divorciar'],
    guildOnly: true,
    cooldown: 5,

    async execute(client, message, args) {
        const db = require('quick.db')
        const mencionado = message.mentions.users.first();
        let casado = await db.fetch(`married_$${message.author.id}`)
        let casado2 = await db.fetch(`married_${mencionado.id}`)
        if(casado != casado2) return message.channel.send(`${mencionado} não está casado com você!`)
        if(casado == null) return message.channel.send("Você não está casado")
        message.channel.send(`:broken_heart: **|** Deseja se divorciar de ${mencionado.username}?`).then(sentMessage => {
            sentMessage.react('✅')
            const filter = (reaction, user) => {
                return ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
            };
            sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                    message.channel.send(`Você se divorciou!`)
                    db.delete(`married_${mencionado.id}`)
                    db.delete(`married_${message.author.id}`)

                })

        })
    }
}