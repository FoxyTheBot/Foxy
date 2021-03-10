module.exports = {
  name: 'deposit',
  aliases: ['deposit', 'depositar', 'dep'],
  guildOnly: true,
  cooldown: 5,

  async run(client, message, args) {
    const db = require('quick.db');
    const user = message.author;

    const money = db.fetch(`coins_${user.id}`);
    if (message.content.includes('-')) return message.reply('Você não pode depositar quantias negativas');

    if (message.content.includes('all')) {
      if (money == 0) return message.reply('Você não tem dinheiro para depositar!');
      db.add(`bal_${user.id}`, money);
      db.subtract(`coins_${user.id}`, money);
      message.reply('<:BradescoLogo:810176327993917520> **|** Você depositou todo seu dinheiro no banco!');
    } else {
      if (!args[0]) return message.reply('Digite uma quantia!');

      if (money < args[0]) return message.reply('Você não tem essa quantia para poder depositar!');

      if (isNaN(args[0])) return message.reply('Digite números válidos!');

      db.subtract(`coins_${user.id}`, args[0]);
      db.add(`bal_${user.id}`, args[0]);
      message.reply(`:money_with_wings: **|** Você depositou ${args[0]} na sua conta bancária.  Caso queira depositar tudo use f!deposit all`);
    }
  },
};
