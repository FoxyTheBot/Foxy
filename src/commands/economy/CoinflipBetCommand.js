const db = require('quick.db')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "bet",
    aliases: ['bet', 'apostar'],
    guildOnly: true,

    async run(client, message, args) {
        const user = message.mentions.users.first()

        const noargs = new MessageEmbed()
        .setColor(client.colors.default)
        .setTitle('💸 | Como apostar')
        .setDescription("`f!bet <user> <cara/coroa> <quantia>`")
        if(!user) return message.reply(noargs)
        
        const authorbal = await db.fetch(`coins_${message.author.id}`)
        const userbal = await db.fetch(`coins_${user.id}`)
    
        if(userbal < args[2]) {
            return message.reply(`💸 **|** ${user} Não tem FoxCoins suficientes para apostar`)
        } 
        if(authorbal < args[2]) {
            return message.reply(`Você não tem FoxCoins o suficiente para fazer apostas`)
        }
        if(!args[2]) return message.reply(noargs)

        if(isNaN(args[2])) return message.reply('Digite números válidos!')
        
        message.reply(`${user}, Você deseja fazer uma aposta de ${args[2]} FoxCoins com ${message.author}?`).then((msg) => {
            msg.react('✅')
            const filterYes = (reaction, usuario) => reaction.emoji.name === '✅' && usuario.id === user.id;
            const yesCollector = msg.createReactionCollector(filterYes, { max: 1, time: 60000 });
            yesCollector.on('collect', () => {

                const array1 = ['cara', 'coroa'];

                const rand = Math.floor(Math.random() * array1.length);
        
                if (!args[1] || (args[1].toLowerCase() !== 'cara' && args[1].toLowerCase() !== 'coroa')) {
                    message.reply(noargs);
        
                  } else if (args[1].toLowerCase() == array1[rand]) {
        
                    message.reply(`💸 **|** Deu **${array1[rand]}**, você ganhou dessa vez! Financiado por ${user} rs`);
                    db.add(`coins_${message.author.id}`, args[2])
                    db.subtract(`coins_${user.id}`, args[2])
        
                  } else if (args[1].toLowerCase() != array1[rand]) {
                    message.reply(`💸 **|** Deu **${array1[rand]}**, você perdeu dessa vez! Financiado por ${message.author} rs`);
                    db.add(`coins_${user.id}`, args[2])
                    db.subtract(`coins_${message.author.id}`, args[2])
                  }
                
        
        
            })
        })
       
        
    }
}