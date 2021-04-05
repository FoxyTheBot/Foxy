const db = require('quick.db')
const { MessageEmbed } = require('discord.js')
module.exports = {
    name: "marry",
    aliases: ['casar', ' marry'],
    cooldown: 5,
    guildOnly: true,

    async run(client, message, args) {
        const marryEmbed = new MessageEmbed()
            .setColor('RED')
            .setTitle('❤ | `f!marry`')
            .setDescription(' Case com sua Webnamorada, você ama essa pessoa? Case com ela! Vocês não precisam de FoxCoins para casar, apenas sejam felizes! \n\n 📚 **Exemplos**')
            .addFields(
                { name: "🔹 Faz um pedido para a pessoa mencionada", value: "`f!marry WinG4merBR#8379`"},
                { name: "ℹ Aliases:", value: "`casar`"}
                )

            .setFooter(`• Autor: ${message.author.tag} - Social`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }));

        const authordata = db.fetch(`married_${message.author.id}`)

        const mentioned = message.mentions.users.first();

        if (!mentioned) return message.reply(marryEmbed)
        if (mentioned === client.user) return message.reply(`Nhe, eu não quero casar com você, aliás eu nem idade para casar tenho! ${client.emotes.rage}`)
        if (mentioned.id === message.author.id) return message.reply(`${client.emotes.error} **|** Ué amiguinho? Por que você quer casar com você mesmo? Uma hora você vai achar o amor da sua vida, eu confio em você! ${client.emotes.heart}`)

        if (authordata && authordata !== 'null') return message.reply(`${client.emotes.rage} **|** Você já está casado! Nem pense em trair!`)

        const user2 = await db.fetch(`married_${mentioned.id}`)

        if (user2 && user2 !== 'null') return message.reply(`${client.emotes.rage} **|** Opa! Calma ai, já ouviu essa frase "Talarico morre cedo"? Toma cuidado! ( **${mentioned.username}** Já está casado)`);
        message.reply(`${client.emotes.heart} **|** ${mentioned} Você recebeu um pedido de casamento de ${message.author}, você tem 1 minuto para aceitar!`).then((msg) => {

            setTimeout(() => msg.react('❌'),
                1000);
            msg.react('💍');
            const filterYes = (reaction, usuario) => reaction.emoji.name === '💍' && usuario.id === mentioned.id;
            const filterNo = (reaction, usuario) => reaction.emoji.name === '❌' && usuario.id === mentioned.id;

            const yesCollector = msg.createReactionCollector(filterYes, { max: 1, time: 60000 });
            const noCollector = msg.createReactionCollector(filterNo, { max: 1, time: 60000 })

            noCollector.on('collect', () => {
                return message.reply(`${client.emotes.broken} **|** Me desculpe ${message.author}, mas seu pedido de casamento foi rejeitado ${client.emotes.sob}`)
            })

            yesCollector.on('collect', () => {
                message.reply(`${client.emotes.heart} **|** ${message.author} e ${mentioned}, Vocês agora estão casados, felicidades para vocês dois! ${client.emotes.heart}`)

                db.set(`married_${message.author.id}`, mentioned.id)
                db.set(`married_${mentioned.id}`, message.author.id)
            })
        })
    }
}

