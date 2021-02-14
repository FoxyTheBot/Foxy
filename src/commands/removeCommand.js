
module.exports = {
    name: "remove",
    aliases: ['remove', 'sacar', 'rem'],
    guildOnly: true,
    cooldown: 5,

    async execute(client, message, args) {
        const db = require("quick.db")
        let user = message.author;
        let bal = db.fetch(`bal_${user.id}`)
        if(message.content.includes("-")) return message.channel.send("Você não pode sacar quantias negativas")
        if(message.content.includes("all")) {

            if(bal == 0) return message.channel.send("Você não possuí dinheiro para sacar!")
            db.subtract(`bal_${user.id}`, bal)
            db.add(`coins_${user.id}`, bal)
            message.channel.send("<:Santander:810177139252133938> **|** Você sacou todo seu dinheiro!")
        } else {

            if (!args[0]) return message.channel.send("Digite uma quantia!")

            if (bal < args[0]) return message.channel.send("Você não tem essa quantia para poder sacar!")

            if (isNaN(args[0])) return message.reply('Digite números válidos!')

            db.subtract(`bal_${user.id}`, args[0])
            db.add(`coins_${user.id}`, args[0])
            message.channel.send(`:money_with_wings: **|** Você sacou ${args[0]} da sua conta bancária. Caso queira sacar tudo use f!remove all`)
        }
    }
}