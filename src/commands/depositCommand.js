module.exports = {
    name: "deposit",
    aliases: ['deposit', 'depositar', 'dep'],
    guildOnly: true,
    cooldown: 5,

    async execute(client, message, args) {
        const db = require("quick.db")
        let user = message.author;

        let money = db.fetch(`coins_${user.id}`)
        if(message.content.includes("-")) return message.channel.send("Você não pode depositar quantias negativas")

        if(message.content.includes("all")) {
            if(money == 0) return message.channel.sen
            d("Você não tem dinheiro para depositar!")
            db.add(`bal_${user.id}`, money)
            db.subtract(`coins_${user.id}`, money)
            message.channel.send("<:BradescoLogo:810176327993917520> **|** Você depositou todo seu dinheiro no banco!")
        } else {


            if (!args[0]) return message.channel.send("Digite uma quantia!")

            if (money < args[0]) return message.channel.send("Você não tem essa quantia para poder depositar!")

            if (isNaN(args[0])) return message.reply('Digite números válidos!')

            db.subtract(`coins_${user.id}`, args[0])
            db.add(`bal_${user.id}`, args[0])
            message.channel.send(`:money_with_wings: **|** Você depositou ${args[0]} na sua conta bancária.  Caso queira depositar tudo use f!deposit all`)
        }
    }
}