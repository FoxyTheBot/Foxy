const { MessageEmbed } = require('discord.js');
const ms = require('parse-ms');
const db = require('quick.db');

module.exports = {
  name: 'rob',
  aliases: ['rob', 'roubar'],
  guildOnly: true,
  cooldown: 5,

  async run(client, message, args) {
    const random = Math.floor((Math.random() * 1000));
    const user = message.mentions.members.first();
    if (!user) {
      return message.channel.send('Mencione alguém para poder roubar');
    }
    const targetuser = await db.fetch(`coins_${user.id}`);
    const author = await db.fetch(`rob_${message.author.id}`);
    const author2 = await db.fetch(`coins_${message.author.id}`);

    if (user == message.author.id) return message.channel.send('Você não pode se roubar!');
    const timeout = 600000;
    if (author !== null && timeout - (Date.now() - author) > 0) {
      const time = ms(timeout - (Date.now() - author));

      const timeEmbed = new MessageEmbed()
        .setColor(client.colors.default)
        .setDescription(`Aguarde **${time.minutes}m ${time.seconds}s** para usar o comando`);
      await message.channel.send(timeEmbed);
    } else {
      const moneyEmbed = new MessageEmbed()
        .setColor(client.colors.default)
        .setDescription('Você precisa de pelo menos 200 coins em sua carteira para roubar alguém');

      if (author2 < 200) {
        return message.channel.send(moneyEmbed);
      }
      const moneyEmbed2 = new MessageEmbed()
        .setColor(client.colors.default)
        .setDescription(`${user.user.username} não tem nada que você possa roubar`);
      if (targetuser <= random) { return message.channel.send(moneyEmbed2); }

      const embed = new MessageEmbed()
        .setDescription(`Você roubou ${user} e ganhou ${random} coins`)
        .setColor(client.colors.default);
      await message.channel.send(embed);

      db.subtract(`coins_${user.id}`, random);
      db.add(`coins_${message.author.id}`, random);
      db.set(`rob_${message.author.id}`, Date.now());
    }
  },
};
