const db = require('quick.db')

module.exports = {
    name: "marry",
    aliases: ['casar',' marry'],
    cooldown: 5,
    guildOnly: true,
    
    async run(client, message, args) {
       const authordata = db.fetch(`married_${message.author.id}`)
       
        const mentioned = message.mentions.users.first();
        
        if(!mentioned) return message.channel.send(`${client.emotes.error} **|** Mencione alguém para casar!`)
        if(mentioned === client.user) return message.channel.send(`Nhe, eu não quero casar com você, aliás eu nem idade para casar tenho! ${client.emotes.rage}`)    
        if(mentioned.id === message.author.id) return message.channel.send(`${client.emotes.error} **|** Ué amiguinho? Por que você quer casar com você mesmo? Uma hora você vai achar o amor da sua vida, eu confio em você! ${client.emotes.heart}`)

    if(authordata && authordata !== 'null') return message.channel.send(`${client.emotes.rage} **|** Você já está casado! Nem pense em trair!`)

    const user2 = await db.fetch(`married_${mentioned.id}`)

    if (user2 && user2 !== 'null') return message.channel.send(`${client.emotes.rage} **|** Opa! Calma ai, já ouviu essa frase "Talarico morre cedo"? Toma cuidado! ( **${mentioned.username}** Já está casado)`);
    message.channel.send(`${client.emotes.heart} **|** ${mentioned} Você recebeu um pedido de casamento de ${message.author} :3`).then((msg) => {

    setTimeout(() => msg.react('❌'),
    1000);
  msg.react('💍');
    const filterYes = (reaction, usuario) => reaction.emoji.name === '💍' && usuario.id === mentioned.id;
    const filterNo = (reaction, usuario) => reaction.emoji.name === '❌' && usuario.id === mentioned.id;

    const yesCollector = msg.createReactionCollector(filterYes, { max: 1, time: 60000});
    const noCollector = msg.createReactionCollector(filterNo, { max: 1, time: 60000})

    noCollector.on('collect', () => {
        return message.channel.send(`${client.emotes.broken} **|** Me desculpe ${message.author}, mas seu pedido de casamento foi rejeitado ${client.emotes.sob}`)
    })

    yesCollector.on('collect', () => {
     message.channel.send(`${client.emotes.heart} **|** ${message.author} e ${mentioned}, Vocês agora estão casados, felicidades para vocês dois! ${client.emotes.heart}`)

    db.set(`married_${message.author.id}`, mentioned.id)
    db.set(`married_${mentioned.id}`, message.author.id)
})
    }
    )}
}

