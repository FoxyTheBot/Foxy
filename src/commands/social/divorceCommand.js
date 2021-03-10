const db = require('quick.db')

module.exports = {
    name: "divorce",
    aliases: ['divorce','divorciar'],
    cooldown: 5,
    guildOnly: true,
    
    async run(client, message, args) {       
        
    const user2 = await db.fetch(`married_${message.author.id}`)
    if (user2 == null) return message.reply(`${client.emotes.broken} Você não está casadx!`);
    const user = await client.users.fetch(user2)
    if(user2 !== user.id) return message.reply(`${user.id} Não está casadx com ${user.username}`)
    message.reply(`${client.emotes.broken} **|** ${message.author}, tem certeza que deseja se divorciar?`).then((msg) => {

    setTimeout(() => msg.react('❌'),
    1000);
  msg.react('💔');
    const filterYes = (reaction, usuario) => reaction.emoji.name === '💔' && usuario.id === message.author.id;
    const filterNo = (reaction, usuario) => reaction.emoji.name === '❌' && usuario.id === message.author.id;

    const yesCollector = msg.createReactionCollector(filterYes, { max: 1, time: 60000});
    const noCollector = msg.createReactionCollector(filterNo, { max: 1, time: 60000})

    noCollector.on('collect', () => {
        msg.reactions.removeAll().catch();
        return message.reply(`${client.emotes.heart} **|** Eita **${message.author.username}** Achei que vocês iriam se divorciar, ainda bem que estava errada :3`)
    })

    yesCollector.on('collect', () => {
        msg.reactions.removeAll().catch();
     message.reply(`${client.emotes.broken} **|** ${message.author} Você se divorciou de ${user.username} :cry:`)

    db.delete(`married_${message.author.id}`)
    db.delete(`married_${user.id}`)
})
    }
    )}
}

