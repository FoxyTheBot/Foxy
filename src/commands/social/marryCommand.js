const db = require('quick.db')
const { MessageEmbed } = require('discord.js')
const { MessageButton } = require('discord-buttons');

module.exports = {
    name: "marry",
    aliases: ['casar'],
    cooldown: 5,
    guildOnly: true,
    clientPerms: ['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'],

    async run(client, message, args) {
        const marryEmbed = new MessageEmbed()
            .setColor('RED')
            .setTitle('❤ | `f!marry`')
            .setDescription(' Case com sua Webnamorada, você ama essa pessoa? Case com ela! Vocês não precisam de FoxCoins para casar, apenas sejam felizes! \n\n 📚 **Exemplos**')
            .addFields(
                { name: "🔹 Faz um pedido para a pessoa mencionada", value: "`f!marry WinG4merBR#7661`" },
                { name: "ℹ Aliases:", value: "`casar`" }
            )

            .setFooter(`• Autor: ${message.author.tag} - Social`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }));

        const authordata = db.fetch(`married_${message.author.id}`)

        const mentioned = message.mentions.users.first();

        if (!mentioned) return message.foxyReply(marryEmbed)

        if (mentioned === client.user) return message.foxyReply(`Nhe, eu não quero casar com você, aliás eu nem idade para casar tenho! ${client.emotes.rage}`)
        if (mentioned.id === message.author.id) return message.foxyReply(`${client.emotes.error} **|** Ué amiguinho? Por que você quer casar com você mesmo? Uma hora você vai achar o amor da sua vida, eu confio em você! ${client.emotes.heart}`)
        if (authordata && authordata !== 'null') return message.foxyReply(`${client.emotes.rage} **|** Você já está casado! Nem pense em trair!`)

        const user2 = await db.fetch(`married_${mentioned.id}`)

        if (user2 && user2 !== 'null') return message.foxyReply(`${client.emotes.rage} **|** **${mentioned.username}** Já está casado`);

        const butaum = new MessageButton()
            .setLabel('Sim')
            .setStyle("red")
            .setEmoji('❤')
            .setID('like_button')

        const request = await message.channel.send(`${client.emotes.heart} **|** ${mentioned} Você recebeu um pedido de casamento de ${message.author}, você tem 1 minuto para aceitar!`, butaum);

        const filter = (button) => button.clicker.user.id === mentioned.id;
        const collector = request.createButtonCollector(filter, { time: 60000 })

        collector.on('collect', () => {
            message.foxyReply(`${client.emotes.heart} **|** ${message.author} e ${mentioned}, Vocês agora estão casados, felicidades para vocês dois! ${client.emotes.heart}`)

            db.set(`married_${message.author.id}`, mentioned.id)
            db.set(`married_${mentioned.id}`, message.author.id)
        })

    }
}
