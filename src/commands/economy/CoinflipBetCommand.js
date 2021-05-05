const db = require('quick.db')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "bet",
    aliases: ['bet', 'apostar'],
    guildOnly: true,
    cooldown: 10,
    async run(client, message, args) {
        const user = message.mentions.users.first()
        if (user == message.author) return message.FoxyReply(`${client.emotes.error} **|** Você não pode apostar consigo mesmo, bobinho`)
        const noargs = new MessageEmbed()
            .setColor(client.colors.default)
            .setTitle('💸 | `f!bet`')
            .setDescription("Aposte com um(a) amigo(a) na sorte\n\n 📚 **Exemplos**")
            .addFields(
                { name: "🔹 Apostando Cara com 1000 FoxCoins", value: "`f!bet WinG4merBR#8379 cara 1000`" },
                { name: "🔹 Apostando Coroa com 2000 FoxCoins", value: "`f!bet WinG4merBR#8379 coroa 2000`" },
                { name: "ℹ Aliases:", value: "`apostar`" }

            )
            .setFooter(`• Autor: ${message.author.tag} - Economia`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }));
      
            if (!user || args[2]) {
             message.FoxyReply(noargs)
        } else if(args[2].includes("-")) {
            message.FoxyReply("Você não pode apostar FoxCoins negativos, bobinho")
        }
        
        let reply = `${user}, Você deseja fazer uma aposta de ${args[2]} FoxCoins com ${message.author}?`

        const authorbal = await db.fetch(`coins_${message.author.id}`)
        const userbal = await db.fetch(`coins_${user.id}`)

        if (userbal < args[2]) {
            return message.FoxyReply(`💸 **|** ${user} Não tem FoxCoins suficientes para apostar`)
        } 

        if (authorbal < args[2]) {
            return message.FoxyReply(`Você não tem FoxCoins o suficiente para fazer apostas`)
        }


        if (isNaN(args[2])) return message.FoxyReply('Digite números válidos!')

        if (user == client.user) reply = "Opa, vamos apostar então!"
        message.FoxyReply(reply).then((msg) => {

            setTimeout(() => msg.react('✅'),
                1000);

            const filterYes = (reaction, usuario) => reaction.emoji.name === '✅' && usuario.id === user.id;
            const yesCollector = msg.createReactionCollector(filterYes, { max: 1, time: 60000 });
            yesCollector.on('collect', () => {

                const array1 = ['cara', 'coroa'];

                const rand = Math.floor(Math.random() * array1.length);

                if (!args[1] || (args[1].toLowerCase() !== 'cara' && args[1].toLowerCase() !== 'coroa')) {
                    message.FoxyReply(noargs);

                } else if (args[1].toLowerCase() == array1[rand]) {

                    message.FoxyReply(`💸 **|** Deu **${array1[rand]}**, você ganhou dessa vez! Financiado por ${user} rs`);
                    db.add(`coins_${message.author.id}`, args[2])
                    db.subtract(`coins_${user.id}`, args[2])

                } else if (args[1].toLowerCase() != array1[rand]) {
                    message.FoxyReply(`💸 **|** Deu **${array1[rand]}**, você perdeu dessa vez! ${user} Você ganhou ${args[2]} FoxCoins, Financiado por ${message.author} rs`);
                    db.add(`coins_${user.id}`, args[2])
                    db.subtract(`coins_${message.author.id}`, args[2])
                }



            })
        })


    }
}