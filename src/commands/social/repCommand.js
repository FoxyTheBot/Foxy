const ms = require('parse-ms');

module.exports = {
    name: 'rep',
    aliases: ['rep'],
    cooldown: 5,
    guildOnly: true,
    clientPerms: ['READ_MESSAGE_HISTORY'],

    async run(client, message, args) {
        const repCooldown = 3600000;

        const userMention = message.mentions.users.first();
        if (!userMention) return message.reply('Mencione alguém para dar reputação!');
        if (userMention == message.author.id) return message.reply('Você não pode dar reputação para si mesmo!');

        const userData = await client.db.getDocument(userMention.id);
        if (!userData) return message.reply(`${client.emotes.error} **|** Este usuário não está no meu banco de dados, bobinho`)

        const authorData = await client.db.getDocument(message.author.id);
        
        if (repCooldown - (Date.now() - authorData.lastRep) > 0) {
            const currentCooldown = ms(repCooldown - (Date.now() - authorData.lastRep));
            return message.reply(`Você não pode dar reputação ao usuário por ${currentCooldown.hours}h ${currentCooldown.minutes}m ${currentCooldown.seconds}s`);
        } else {
            userData.repCount++;
            authorData.lastRep = Date.now();
            await userData.save();
            await authorData.save();
            return message.reply(`${client.emotes.heart} **|** Você deu reputação ao usuário ${userMention}`);
        }
    },
};
