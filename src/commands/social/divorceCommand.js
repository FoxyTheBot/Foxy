const db = require('quick.db')

module.exports = {
    name: "divorce",
    aliases: ['divorce','divorciar'],
    cooldown: 5,
    guildOnly: true,
    
    async run(client, message, args) {       
        
    const user2 = await db.fetch(`married_${message.author.id}`)
    if (user2 == null) return message.inlineReply(`${client.emotes.broken} Você não está casadx!`);
    const user = await client.users.fetch(user2)
    if(user2 !== user.id) return message.inlineReply(`${user.id} Não está casadx com ${user.username}`)
    message.inlineReply(`${client.emotes.broken} **|** Então é o fim? Você quer realmente se divorciar de **${user.username}**?`).then((msg) => {
        
  msg.react('💔');
    const filterYes = (reaction, usuario) => reaction.emoji.name === '💔' && usuario.id === message.author.id;

    const yesCollector = msg.createReactionCollector(filterYes, { max: 1, time: 60000});

    yesCollector.on('collect', () => {
        msg.reactions.removeAll().catch();
     message.inlineReply(`${client.emotes.broken} **|** ${message.author} ...Então é isso, se divorciar é sim uma coisa triste, Da próxima vez ame alguém que realmente mereça e respeite você, sim isso parece ser difícil pois o amor é algo cego e incontrolável... Mas é melhor estar sozinho do que mal acompanhado, eu confio em você! :heart:`)

    db.delete(`married_${message.author.id}`)
    db.delete(`married_${user.id}`)
})
    }
    )}
}

