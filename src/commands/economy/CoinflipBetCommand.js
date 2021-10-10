const { MessageEmbed } = require('discord.js')
const user = require('../../structures/databaseConnection');

module.exports = {
    name: "bet",
    aliases: ['bet', 'apostar'],
    guildOnly: true,
    cooldown: 10,
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
        const userMention = message.mentions.users.first()
        if (userMention == message.author) return message.foxyReply(`${client.emotes.error} **|** Você não pode apostar consigo mesmo, bobinho`)
        const noargs = new MessageEmbed()
            .setColor(client.colors.default)
            .setTitle('💸 | `f!bet`')
            .setDescription("Aposte com um(a) amigo(a) na sorte\n\n 📚 **Exemplos**")
            .addFields(
                { name: "🔹 Apostando Cara com 1000 FoxCoins", value: "`f!bet WinG4merBR#7661 cara 1000`" },
                { name: "🔹 Apostando Coroa com 2000 FoxCoins", value: "`f!bet WinG4merBR#7661 coroa 2000`" },
                { name: "ℹ Aliases:", value: "`apostar`" }

            )
            .setFooter(`• Autor: ${message.author.tag} - Economia`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }));

        if (!userMention) return message.foxyReply(noargs)
        const mentionData = await user.findOne({ user: userMention.id });
        if (!args[2]) return message.foxyReply(noargs)

        if (isNaN(args[2])) {
            return message.foxyReply(noargs)
        } else if (args[2].includes("-")) {
            message.foxyReply("Você não pode apostar FoxCoins negativos, bobinho")
        }

        const userbal = await user.findOne({ user: userMention.id });
        const authorbal = await user.findOne({ user: message.author.id });

        let reply = `${userMention}, Você deseja fazer uma aposta de ${args[2]} FoxCoins com ${message.author}?`


        if (userbal < args[2]) {
            return message.foxyReply(`💸 **|** ${user} Não tem FoxCoins suficientes para apostar`)
        }

        if (authorbal < args[2]) {
            return message.foxyReply(`Você não tem FoxCoins o suficiente para fazer apostas`)
        }

        if (userMention == client.user) reply = "Opa, vamos apostar então!"
        message.foxyReply(reply).then((msg) => {

            setTimeout(() => msg.react('✅'),
                1000);

            const filterYes = (reaction, usuario) => reaction.emoji.name === '✅' && usuario.id === user.id;
            const yesCollector = msg.createReactionCollector(filterYes, { max: 1, time: 60000 });
            yesCollector.on('collect', () => {

                const array1 = ['cara', 'coroa'];

                const rand = Math.floor(Math.random() * array1.length);

                if (!args[1] || (args[1].toLowerCase() !== 'cara' && args[1].toLowerCase() !== 'coroa')) {
                    message.foxyReply(noargs);

                } else if (args[1].toLowerCase() == array1[rand]) {

                    message.foxyReply(`💸 **|** Deu **${array1[rand]}**, você ganhou dessa vez! Financiado por ${user} rs`);
                    userData.coins += args[2]
                    userData.save()
                    mentionData.coins -= args[2]
                    mentionData.save()
                } else if (args[1].toLowerCase() != array1[rand]) {
                    message.foxyReply(`💸 **|** Deu **${array1[rand]}**, você perdeu dessa vez! ${user} Você ganhou ${args[2]} FoxCoins, Financiado por ${message.author} rs`);
                    userData.coins -= args[2]
                    mentionData.coins += args[2]
                    mentionData.save()
                    userData.save()
                }
            })
        })


    }
}