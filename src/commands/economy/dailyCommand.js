const user = require('../../structures/databaseConnection');

module.exports = {
  name: 'daily',
  aliases: ['daily', 'ganhapão', 'ganhapao', 'bolsafamília', 'bolsafamilia', 'auxilio', 'auxilioemergencial', 'auxílioemergencial', 'mesada', 'medadinheiro', "esmola"],
  cooldown: 5,
  guildOnly: true,

  async run(client, message) {
    const ms = require('ms');
    const userData = await user.findOne({ user: message.author.id });

    if (!userData) {
      message.foxyReply("Parece que você não está no meu banco de dados, execute o comando novamente!");
      return new user({
        user: message.author.id,
        coins: 0,
        lastDaily: null,
        reps: 0,
        lastRep: null,
        backgrounds: ['default.png'],
        background: 'default.png',
        aboutme: null,
        marry: null,
        premium: false,
      }).save().catch(err => console.log(err));
    }
    const timeout = 43200000;
    var amount = Math.floor(Math.random() * 3200);

    if (userData.premium) amount = Math.floor(Math.random() * 3200) + 1000;

    const daily = await userData.lastDaily;
    if (daily !== null && timeout - (Date.now() - daily) > 0) {
      return message.foxyReply(`💸 **|** Você já pegou seu daily, tente novamente mais tarde!`);
    } else {

      userData.coins += amount;
      userData.lastDaily = Date.now();
      userData.save().catch(err => console.log(err));

      const money = await userData.coins;

      message.foxyReply(`💵 **|** Você coletou seu daily e ganhou ${amount} FoxCoins! Agora você possui ${money} FoxCoins`);
    }
  },
};
