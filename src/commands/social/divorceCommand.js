
module.exports = {
    name: "divorce",
    aliases: ['divorce', 'divorciar'],
    cooldown: 5,
    guildOnly: true,
    clientPerms: ['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'],

    async run(client, message, args) {
        const user = require('../../structures/databaseConnection');

        const userData = await user.findOne({ user: message.author.id });

        if (!userData) {
            message.foxyReply("Parece que você não está no meu banco de dados, execute o comando novamente!");
            return new user({
                user: userData.id,
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

        const user2 = userData.marry;
        if(!user2) return message.foxyReply("Você não está casado!");
        const marriedUser = await user.findOne({ user: user2 });
        if (!marriedUser) return message.foxyReply(`${client.emotes.error} **|** Este usuário não está no meu banco de dados, bobinho`)

        if (user2 == null) return message.foxyReply(`${client.emotes.broken} Você não está casado(a)!`);
        const married = await client.users.fetch(user2)
        message.foxyReply(`${client.emotes.broken} **|** Então é o fim? Você quer realmente se divorciar de **${married.username}**?`).then((msg) => {

            msg.react('💔');
            const filterYes = (reaction, usuario) => reaction.emoji.name === '💔' && usuario.id === message.author.id;

            const yesCollector = msg.createReactionCollector(filterYes, { max: 1, time: 60000 });

            yesCollector.on('collect', () => {
                msg.reactions.removeAll().catch();
                message.foxyReply(`${client.emotes.broken} **|** ${message.author} ...Então é isso, se divorciar é sim uma coisa triste, Da próxima vez ame alguém que realmente mereça e respeite você, sim isso parece ser difícil pois o amor é algo cego e incontrolável... Mas é melhor estar sozinho do que mal acompanhado, eu confio em você! :heart:`)

                userData.marry = null;
                marriedUser.marry = null;
                userData.save().catch(err => console.log(err));
                marriedUser.save().catch(err => console.log(err));
            })
        }
        )
    }
}