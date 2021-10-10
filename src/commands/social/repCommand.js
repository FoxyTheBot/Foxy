const user = require('../../structures/databaseConnection');
const ms = require('parse-ms');

module.exports = {
    name: 'rep',
    aliases: ['rep'],
    cooldown: 5,
    guildOnly: true,
    clientPerms: ['READ_MESSAGE_HISTORY'],

    async run(client, message, args) {
        const userMention = message.mentions.users.first();
        if (!userMention) return message.foxyReply('Mencione alguém para dar reputação!');

        const userData = await user.findOne({ user: userMention.id });
        const authorData = await user.findOne({ user: message.author.id });
        if (userMention == message.author.id) return message.foxyReply('Você não pode dar reputação para si mesmo!');


        if (!userData) return message.foxyReply(`${client.emotes.error} **|** Este usuário não está no meu banco de dados, bobinho`)

        if (!authorData) {
            message.foxyReply("Parece que você não está no meu banco de dados, execute o comando novamente!");
            return new user({
                user: userMention.id,
                coins: 0,
                lastDaily: null,
                reps: 0,
                lastRep: null,
                backgrounds: ['default.png'],
                background: 'default.png',
                aboutme: null,
                marry: null,
                marry: null,
                premium: false,
            }).save().catch(err => console.log(err));

        }
        const timeout = 3600000;
        const rep = await userData.reps;
        const lastRep = await authorData.lastRep;
        if (rep !== null && timeout - (Date.now() - lastRep) > 0) {
            const time = ms(timeout - (Date.now() - lastRep));
            return message.foxyReply(`Você não pode dar reputação ao usuário por ${time.hours}h ${time.minutes}m ${time.seconds}s`);
        } else {
            userData.reps = rep + 1;
            authorData.lastRep = Date.now();
            await userData.save();
            await authorData.save();
            return message.foxyReply(`${client.emotes.check} **|** Você deu reputação ao usuário ${userMention}`);
        }
    },
};
