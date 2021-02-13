const { execute } = require("./bankCommand");

module.exports = {
    name: "deposit",
    aliases: ['deposit', 'depositar'],
    guildOnly: true,
    cooldown: 5,

    async execute(client, message, args) {
        const db = require("quick.db")
        let user = message.author;

        let money = db.fetch(`coins_${user.id}`)
        let bal = db.fetch(`bal_${user.id}`)
        if(!args[0]) return message.channel.send("Digite uma quantia!")

        if(money < args[0]) return message.channel.send("Você não tem essa quantia para poder depositar!")
        
        if(isNaN(args[0])) return message.reply('Digite números válidos!')
        
        db.subtract(`coins_${user.id}`, args[0])
        db.add(`bal_${user.id}`, args[0])
        message.channel.send(`:money_with_wings: **|** Você depositou ${args[0]} na sua conta bancária.`)
    
    }
}