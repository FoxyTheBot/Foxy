
module.exports = {
    name: "pay",
    aliases: ['pay', 'pagar'],
    cooldown: 5,
    guildOnly: true,

    async execute(client, message, args) {
const db = require("quick.db");
        let user = message.mentions.members.first() 

        let member = db.fetch(`coins_${message.author.id}`)
    
      if(user == message.author.id) return message.reply("Você não pode transferir coins para si mesmo")
      if(user == client.user.id) return message.reply("Nah, eu não quero coins, mas você pode ganhar mais coins usando f!roleta!")
        if (!user) {
            return message.channel.send(`Mencione alguém que deseja transferir seus coins`)
        }
        if(isNaN(args[1])) return message.reply('Digite números válidos!')        
        if (!args[1]) {
            return message.channel.send(`Especifique uma quantidade para ser transferida`)
        }

      
        if (message.content.includes('-')) { 
            return message.channel.send(`Você não pode transferir coins negativas`)
        }
      
        const fetchValue = db.fetch(`coins_${message.author.id}`);

        if(args[1] > fetchValue) return message.channel.send(`Você não tem coins suficiente`)
      
        message.channel.send(`Você quer mesmo transferir ${args[1]} FoxCoins para ${user.user}?`).then(sentMessage => {
            sentMessage.react('✅')
            const filter = (reaction, user) => {
                return ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
            };           
            sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
               message.channel.send(`Você transferiu ${args[1]} FoxCoins para ${user.user}`)
        
                db.add(`coins_${user.id}`, args[1])
        db.subtract(`coins_${message.author.id}`, args[1])
            })
        })
        
    }
}