const user = require('../../structures/databaseConnection');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "marry",
    aliases: ['casar', ' marry'],
    cooldown: 5,
    guildOnly: true,
    clientPerms: ['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'],

    async run(client, message, args) {
        const userData = await user.findOne({ user: message.author.id });
        if (!userData) {
            message.foxyReply("Parece que você não está no meu banco de dados, execute o comando novamente!");
            return new user({
                 user: message.author.id,
                coins: 0,
                lastDaily: null,
                reps: 0,
                lastRep: null,
                backgrounds: ['default.png'],
                background: 'default.png',
                aboutme: null,
                marry: null,
                premium: false,
            }).save().catch(err => console.log(err));

        }

        const marryEmbed = new MessageEmbed();
        marryEmbed.setColor('RED');
        marryEmbed.setTitle('❤ | `f!marry`');
        marryEmbed.setDescription(' Case com sua Webnamorada, você ama essa pessoa? Case com ela! Vocês não precisam de FoxCoins para casar, apenas sejam felizes! \n\n 📚 **Exemplos**');
        marryEmbed.addFields(
            { name: "🔹 Faz um pedido para a pessoa mencionada", value: "`f!marry WinG4merBR#7661`" },
            { name: "ℹ Aliases:", value: "`casar`" }
        );

        marryEmbed.setFooter(`• Autor: ${message.author.tag} - Social`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }));

        if (userData.marry) return message.foxyReply("Você já está casado com alguém!");
        const mentioned = message.mentions.users.first();

        if (!mentioned) return message.foxyReply(marryEmbed)
        if (mentioned === client.user) return message.foxyReply(`Nhe, eu não quero casar com você, aliás eu nem idade para casar tenho! ${client.emotes.rage}`);
        if (mentioned.id === message.author.id) return message.foxyReply(`${client.emotes.error} **|** Ué amiguinho? Por que você quer casar com você mesmo? Uma hora você vai achar o amor da sua vida, eu confio em você! ${client.emotes.heart}`);
        if (mentioned.id === userData.marry) return message.foxyReply(`${client.emotes.error} **|** Você já está casado com ${mentioned.username}!`);
        
        const mentionData = await user.findOne({ user: mentioned.id });
        if (!mentionData) return message.foxyReply(`${client.emotes.error} **|** Este usuário não está no meu banco de dados, bobinho`)
        if (mentionData.marry) return message.foxyReply(`${client.emotes.error} **|** ${mentioned.username} já está casado com alguém!`);

        message.foxyReply(`${client.emotes.heart} **|** ${mentioned} Você recebeu um pedido de casamento de ${message.author}, você tem 1 minuto para aceitar!`).then((msg) => {

            setTimeout(() => msg.react('❌'),
                1000);
            msg.react('💍');
            const filterYes = (reaction, usuario) => reaction.emoji.name === '💍' && usuario.id === mentioned.id;
            const filterNo = (reaction, usuario) => reaction.emoji.name === '❌' && usuario.id === mentioned.id;

            const yesCollector = msg.createReactionCollector(filterYes, { max: 1, time: 60000 });
            const noCollector = msg.createReactionCollector(filterNo, { max: 1, time: 60000 });

            noCollector.on('collect', () => {
                return message.foxyReply(`${client.emotes.broken} **|** Me desculpe ${message.author}, mas seu pedido de casamento foi rejeitado ${client.emotes.sob}`);
            })

            yesCollector.on('collect', () => {
                message.foxyReply(`${client.emotes.heart} **|** ${message.author} e ${mentioned}, Vocês agora estão casados, felicidades para vocês dois! ${client.emotes.heart}`);

                userData.marry = mentioned.id;
                mentionData.marry = message.author.id;
                userData.save();
                mentionData.save();
            })
        })
    }
}