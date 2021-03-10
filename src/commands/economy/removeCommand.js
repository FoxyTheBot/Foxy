module.exports = {
  name: 'remove',
  aliases: ['remove', 'sacar', 'rem'],
  guildOnly: true,
  cooldown: 5,

  async run(client, message, args) {
    const db = require('quick.db');
    const user = message.author;
    const bal = db.fetch(`bal_${user.id}`);

    if (message.content.includes('-')) return message.reply('Você não pode sacar quantias negativas');
    switch (args[0]) {
      case 'all':
        if (bal == 0) return message.reply('Você não possuí dinheiro para sacar!');
        db.subtract(`bal_${user.id}`, bal);
        db.add(`coins_${user.id}`, bal);
        message.reply('<:Santander:810177139252133938> **|** Você sacou todo seu dinheiro!');
        break;

      default:
        if (!args[0]) return message.reply('Digite uma quantia!');

        if (bal < args[0]) return message.reply('Você não tem essa quantia para poder sacar!');

        if (isNaN(args[0])) return message.reply('Digite números válidos!');

        db.subtract(`bal_${user.id}`, args[0]);
        db.add(`coins_${user.id}`, args[0]);
        message.reply(`:money_with_wings: **|** Você sacou ${args[0]} da sua conta bancária. Caso queira sacar tudo use f!remove all`);
    }
  },
};
