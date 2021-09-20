const db = require("quick.db")
const ms = require('parse-ms')
module.exports = {
    name: "work",
    aliases: ['work', 'trabalhar', 'trabalho', 'wr'],
    guildOnly: true,
    cooldown: 5,

    async run(client, message) {

        const user = message.author;
        const author = await db.fetch(`work_${user.id}`)

        let timeout = 600000;

        if (author !== null && timeout - (Date.now() - author) > 0) {
            let time = ms(timeout - (Date.now() - author));

            message.foxyReply(`😴 **|** Você já trabalhou, descanse um pouco. Tente novamente em **${time.minutes}m ${time.seconds}s**`)

        } else {

            const replies = ['Programador', 'Construtor', 'Garçom', 'Chefe', 'Mecânico']

            const result = Math.floor((Math.random() * replies.length));
            const amount = 500;

            message.foxyReply(`🌟 **|** Você trabalhou como ${replies[result]} e ganhou ${amount} FoxCoins!`)

            db.add(`coins_${user.id}`, amount)
            db.set(`work_${user.id}`, Date.now())
        }

    }
}