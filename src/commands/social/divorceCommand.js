
module.exports = {
    name: "divorce",
    aliases: ['divorce', 'divorciar'],
    cooldown: 5,
    guildOnly: true,
    clientPerms: ['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'],

    async run(client, message, args) {
        const userData = await client.db.getDocument(message.author.id)

        if(!userData.marriedWith) return message.reply("Você não está casado!");

        const marriedUser = await client.db.getDocument(userData.marriedWith);
        if (!marriedUser) console.error("[Social] - What the fuck, como que ele está casado com algúem que não está no banco de dados!????");

        const married = await client.users.fetch(userData.marriedWith);
        message.reply(`${client.emotes.broken} **|** Então é o fim? Você quer realmente se divorciar de **${married.username}**?`).then((msg) => {
            msg.react('💔');
            const filterYes = (reaction, usuario) => reaction.emoji.name === '💔' && usuario.id === message.author.id;

            const yesCollector = msg.createReactionCollector(filterYes, { max: 1, time: 60000 });

            yesCollector.on('collect', () => {
                msg.delete();

                userData.marriedWith = null;
                userData.marriedDate = null;
                marriedUser.marriedWith = null;
                marriedUser.marriedDate = null;
                userData.save().catch(err => console.log(err));
                marriedUser.save().catch(err => console.log(err));

                return message.reply(`${client.emotes.broken} **|** ${message.author} ...Então é isso, se divorciar é sim uma coisa triste, Da próxima vez ame alguém que realmente mereça e respeite você, sim isso parece ser difícil pois o amor é algo cego e incontrolável... Mas é melhor estar sozinho do que mal acompanhado, eu confio em você! :heart:`)
            })

            yesCollector.on("end", () => {
                return msg.delete();
            })
        }
        )
    }
}