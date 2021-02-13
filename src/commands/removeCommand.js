const { guildOnly, execute } = require("./bankCommand");

module.exports = {
    name: "remove",
    aliases: ['remove', 'sacar'],
    guildOnly: true,
    cooldown: 5,

    async execute(client, message, args) {
        const db = require("quick.db")
        let user = message.author;
        let bal = db.fetch(`bal_${user.id}`)
        let money = await db.fetch(`coins_${user.id}`)
        if(!args[0]) return message.channel.send("Digite uma quantia!")

        if(bal < args[0]) return message.channel.send("Você não tem essa quantia para poder sacar!")
        
        if(isNaN(args[0])) return message.reply('Digite números válidos!')
        
        db.subtract(`bal_${user.id}`, args[0])
        db.add(`coins_${user.id}`, args[0])
        message.channel.send(`:money_with_wings: **|** Você sacou ${args[0]} da sua conta bancária.`)
    
    }
}