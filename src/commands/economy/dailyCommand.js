module.exports = {
  name: 'daily',
  aliases: ['daily'],
  cooldown: 5,
  guildOnly: true,

  async run(client, message) {
    const db = require('quick.db');
    const ms = require('parse-ms');

    const user = message.author;

    const timeout = 43200000;
    const amount = Math.floor(Math.random() * 3200);

    const daily = await db.fetch(`daily_${user.id}`);
    if (daily !== null && timeout - (Date.now() - daily) > 0) {
      const time = ms(timeout - (Date.now() - daily));

      message.reply(`💸 **|** Você já pegou seu daily hoje! Tente novamente em **${time.hours}h ${time.minutes}m ${time.seconds}s**`);
    } else {
      db.add(`coins_${user.id}`, amount);
      db.set(`daily_${user.id}`, Date.now());

      const money = await db.fetch(`coins_${user.id}`);
      message.reply(`💵 **|** Você coletou seu daily você ganhou ${amount} FoxCoins! Agora você possui ${money} FoxCoins na sua conta!`);
    }
  },
};
