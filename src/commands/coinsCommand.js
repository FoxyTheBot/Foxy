module.exports = {
    name: "coins",
    aliases: ['lsx', 'coins', 'lslc'],
    cooldown: 1 ,
    guildOnly: true,

    async execute(client, message, args) {
        let ownerID = '708493555768885338'
        if(message.author.id !== ownerID) return;
      const db = require('quick.db')
        let user = message.mentions.members.first() || message.author;
        if(!user) return message.reply("Tente: f!lsx <add/remove> 500 <menção>")
        if (message.content.includes('remove_coins')) {
          if (isNaN(args[1])) return;
          db.subtract(`coins_${user.id}`, args[1])
          let bal = await db.fetch(`coins_${user.id}`)

          message.channel.send(`Removido ${args[1]} FoxCoins de ${user} agora ele(a) possui ${bal} FoxCoins`)
        } 
        if(message.content.includes('add_coins')) {
            db.add(`coins_${user.id}`, args[1])
            let bal = await db.fetch(`coins_${user.id}`)

            message.channel.send(`Foram adicionados ${args[1]} FoxCoins na conta de ${user} agora ele(a) possui ${bal} FoxCoins`)
        }
      
    }
}