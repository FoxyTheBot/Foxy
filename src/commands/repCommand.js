const emotes = require('../structures/emotes.json');

module.exports = {
  name: 'rep',
  aliases: ['rep'],
  cooldown: 5,
  guildOnly: true,

  async run(client, message, args) {
    const db = require('quick.db');
    const ms = require('parse-ms');

    const user = message.mentions.members.first();

    if (user == message.author.id) return message.reply('Você não pode dar reputação para si mesmo!');

    if (!user) return message.channel.send('Mencione alguém para dar reputação!');

    const timeout = 3600000;
    const amount = 1;
    const rep = db.fetch(`rep_${user.id}`);
    const out = db.fetch(`timeout_${message.author.id}to_${user.id}`);
    if (rep !== null && timeout - (Date.now() - out) > 0) {
      const time = ms(timeout - (Date.now() - out));

      message.channel.send(`Você precisa esperar **${time.hours}h ${time.minutes}m ${time.seconds}s** para dar reputação para ${user} novamente`);
    } else {
      db.add(`rep_${user.id}`, amount);
      db.set(`timeout_${message.author.id}to_${user.id}`, Date.now());
      const nowrep = db.fetch(`rep_${user.id}`);
      message.channel.send(`${emotes.heart} **|** deu ${amount} reputação para ${user} agora ele(a) possui ${nowrep} reputações`);
    }
  },
};
