module.exports = {
    name: "daily",
    aliases: ['daily'],
    cooldown: 5,
    guildOnly: true,

    async execute(client, message, args) {
        const db = require("quick.db");
const ms = require("parse-ms");


let user = message.author;

let timeout = 86400000;
let amount = Math.floor(Math.random() * 3200);

let daily = await db.fetch(`daily_${user.id}`);
if (daily !== null && timeout - (Date.now() - daily) > 0) {
  let time = ms(timeout - (Date.now() - daily));

  message.channel.send(`💸 **|** Você já pegou seu daily hoje! Tente novamente em **${time.hours}h ${time.minutes}m ${time.seconds}s**`)
} else {
db.add(`coins_${user.id}`, amount)
db.set(`daily_${user.id}`, Date.now())

let money = await db.fetch(`coins_${user.id}`)
message.channel.send(`💵 **|** Você coletou seu daily você ganhou ${amount} FoxCoins! Agora você possui ${money} FoxCoins`)


}
    }
}