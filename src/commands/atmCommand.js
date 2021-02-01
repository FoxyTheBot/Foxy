module.exports = {
    name: "atm",
    aliases: ['money', 'atm'],
    cooldown: 5,
    guildOnly: false,

    async execute(client, message, args) {
        const db = require('quick.db')
        let user = message.mentions.members.first() || message.author;

        let bal = db.fetch(`coins_${user.id}`)
      
        if (bal === null) bal = 0;
      
                if(user == message.author) return message.channel.send(`💵 **|** ${user} você possui ${bal} FoxCoins`)
      
        message.channel.send(`💵 **|** ${message.author}, ${user} possui ${bal} FoxCoins`)
      
      
    }
}

