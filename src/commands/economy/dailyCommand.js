module.exports = {
  name: 'daily',
  aliases: ['daily', 'ganhapão', 'ganhapao', 'bolsafamília', 'bolsafamilia', 'auxilio', 'auxilioemergencial', 'auxílioemergencial', 'mesada', 'medadinheiro', "esmola"],
  cooldown: 5,
  guildOnly: true,

  async run(client, message) {
    const userData = await client.db.getDocument(message.author.id);

    const timeout = 43200000;
    var amount = Math.floor(Math.random() * 3200);

    if (userData.premium) amount = Math.floor(Math.random() * 3200) + 4628;

    const daily = await userData.lastDaily;
    if (daily !== null && timeout - (Date.now() - daily) > 0) {
      return message.reply(`💸 **|** Você já pegou seu daily, tente novamente mais tarde!`);
    } else {

      userData.balance += amount;
      userData.lastDaily = Date.now();
      userData.save().catch(err => console.log(err));

      const money = await userData.balance;
      if(userData.premium) {
        message.reply(`💵 **|** Você ia ganhar ${amount - 4628} FoxCoins mas graças ao seu premium você ganhou ${amount} FoxCoins e tem ${money} FoxCoins`)
      } else {
        message.reply(`💵 **|** Você coletou seu daily e ganhou ${amount} FoxCoins! Agora você possui ${money} FoxCoins`);
      }
    }
  },
};
