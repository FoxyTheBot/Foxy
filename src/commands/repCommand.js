
module.exports = {
    name: "rep",
    aliases: ['rep'],
    cooldown: 5,
    guildOnly: true,

    async execute(client, message, args) {
        const db = require('quick.db')
        const ms = require("parse-ms");

        let user = message.mentions.members.first()

        let author = message.author.id; 

        if(user == author) return message.reply(`Você não pode dar reputação para si mesmo!`);

        if(!user) return message.channel.send("Mencione alguém para dar reputação!")
        
            let timeout = 3600000;
            let amount = 1;
        let rep =  db.fetch(`rep_${user.id}`);
        let out =  db.fetch(`timeout_${author.id}to_${user.id}`)
        if(rep !== null && timeout - (Date.now() - out) > 0 ) {
            let time = ms(timeout -(Date.now() - out));

            message.channel.send(`Você precisa esperar **${time.hours}h ${time.minutes}m ${time.seconds}s** para dar reputação para ${user} novamente`)

        } else {
            db.add(`rep_${user.id}`, amount)
            db.set(`timeout_${author.id}to_${user.id}`, Date.now())
            if(rep > 1) return message.channel.send(`Você deu ${amount} reputação para ${user} agora ele(a) possui ${rep} reputações`)

        }
    }
}