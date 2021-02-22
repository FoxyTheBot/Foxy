module.exports = {
    name: "marry",
    aliases: ['marry', 'casar'],
    guildOnly: true,
    cooldown: 5,

    async execute(client, message, args) {
        const db = require("quick.db")
        let author = message.author;

        const mencionado = message.mentions.users.first();
        let usermarry = await db.fetch(`married_${author.id}`)
        let married = await db.fetch(`married_${mencionado.id}`)
        if(married != null) {
            message.channel.send(`:broken_heart: **|** ${mencionado} Já está casado!`)
        } else {
            if(usermarry != null) {
                message.channel.send("Você não pode casar, você já está casado! Nem pense em trarir >:c")
            } else {


                message.channel.send(`${mencionado}, ${author} te pediu em casamento, você aceita? :3`).then(sentMessage => {
                    sentMessage.react('✅')
                    const filter = (reaction, user) => {
                        return ['✅'].includes(reaction.emoji.name) && user.id === mencionado.id;
                    };
                    sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                        .then(collected => {
                            message.channel.send(`Você se casou com ${mencionado} felicidade para vocês dois :3`)
                            db.set(`married_${mencionado.id}`, `${message.author.tag}`)
                            db.set(`married_${message.author.id}`, `${mencionado.tag}`)

                        })

                })



            }
        }
    }
}