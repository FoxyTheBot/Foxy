const partner = require('../../utils/partnersGuilds.json')

module.exports = {
  name: 'daily',
  aliases: ['daily', 'ganhapão', 'ganhapao', 'bolsafamília', 'bolsafamilia', 'auxilio', 'auxilioemergencial', 'auxílioemergencial', 'mesada', 'medadinheiro'],
  cooldown: 5,
  guildOnly: true,

  async run(client, message) {
    const db = require('quick.db');
    const ms = require('parse-ms');

    const user = message.author;

    const timeout = 43200000;
    var amount = Math.floor(Math.random() * 3200);

    if (partner.guilds.includes(message.guild.id)) {
      amount = Math.floor(Math.random() * 6400)
    }

    const daily = await db.fetch(`daily_${user.id}`);
    if (daily !== null && timeout - (Date.now() - daily) > 0) {
      const time = ms(timeout - (Date.now() - daily));

      message.foxyReply(`💸 **|** Você já pegou seu daily hoje! Tente novamente em **${time.hours}h ${time.minutes}m ${time.seconds}s**`);
    } else {

      db.add(`coins_${user.id}`, amount);
      db.set(`daily_${user.id}`, Date.now());

      const money = await db.fetch(`coins_${user.id}`);
      if (partner.guilds.includes(message.guild.id)) {

        message.foxyReply(`${client.emotes.success} **|** Você coletou seu daily no servidor: ${message.guild.name}! Sabia que você ganhou o dobro de FoxCoins porque pegou daily em um dos servidores relacionados a Foxy? Você ganhou ${amount} FoxCoins!`);
      } else {
        message.foxyReply(`💵 **|** Você coletou seu daily você ganhou ${amount} FoxCoins! Agora você possui ${money} FoxCoins na sua conta!`);
      }
    }
  },
};
