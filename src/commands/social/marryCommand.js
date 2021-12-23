const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "marry",
    aliases: ['casar', ' marry'],
    cooldown: 5,
    guildOnly: true,
    clientPerms: ['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'],

    async run(client, message, args) {
        const userData = await client.db.getDocument(message.author.id);

        if (userData.marriedWith) return message.reply("Você já está casado com alguém!");
        const mentioned = message.mentions.users.first();

        if (!mentioned || !args) {
            const marryEmbed = new MessageEmbed().setColor('RED').setTitle('❤ | `f!marry`')
                .setDescription(' Case com sua Webnamorada, você ama essa pessoa? Case com ela! Vocês não precisam de FoxCoins para casar, apenas sejam felizes! \n\n 📚 **Exemplos**')
                .addFields(
                    { name: "🔹 Faz um pedido para a pessoa mencionada", value: "`f!marry WinG4merBR#7661`" },
                    { name: "ℹ Aliases:", value: "`casar`" }
                )
                .setFooter(`• Autor: ${message.author.tag} - Social`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }));

            return message.reply(marryEmbed)
        }

        if (mentioned === client.user) return message.reply(`Nhe, eu não quero casar com você, aliás eu nem idade para casar tenho! ${client.emotes.rage}`);
        if (mentioned.id === message.author.id) return message.reply(`${client.emotes.error} **|** Ué amiguinho? Por que você quer casar com você mesmo? Uma hora você vai achar o amor da sua vida, eu confio em você! ${client.emotes.heart}`);
        if (mentioned.id === userData.marriedWith) return message.reply(`${client.emotes.error} **|** Você já está casado com ${mentioned.username}!`);

        const mentionData = await client.db.getDocument(mentioned.id);
        if (!mentionData) return message.reply(`${client.emotes.error} **|** Este usuário não está no meu banco de dados, bobinho`)
        if (mentionData.marriedWith) return message.reply(`${client.emotes.error} **|** ${mentioned.username} já está casado com alguém!`);

        message.reply(`${client.emotes.heart} **|** ${mentioned} Você recebeu um pedido de casamento de ${message.author}, você tem 1 minuto para aceitar!`).then((msg) => {
            msg.react('💍');
            setTimeout(() => msg.react('❌'), 1000);

            const filterYes = (reaction, usuario) => reaction.emoji.name === '💍' && usuario.id === mentioned.id;
            const filterNo = (reaction, usuario) => reaction.emoji.name === '❌' && usuario.id === mentioned.id;

            const yesCollector = msg.createReactionCollector(filterYes, { max: 1, time: 60000 });
            const noCollector = msg.createReactionCollector(filterNo, { max: 1, time: 60000 });

            noCollector.on('collect', async () => {
                await msg.delete()
                return message.reply(`${client.emotes.broken} **|** Me desculpe ${message.author}, mas seu pedido de casamento foi rejeitado ${client.emotes.sob}`);
            })

            yesCollector.on('collect', async () => {
                userData.marriedWith = mentioned.id;
                userData.marriedDate = Date.now();
                mentionData.marriedWith = message.author.id;
                mentionData.marriedDate = Date.now();
                userData.save();
                mentionData.save();

                await msg.delete();
                return message.reply(`${client.emotes.heart} **|** ${message.author} e ${mentioned}, Vocês agora estão casados, felicidades para vocês dois! ${client.emotes.heart}`);
            })
        })
    }
}