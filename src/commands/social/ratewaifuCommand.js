module.exports = {
  name: 'ratewaifu',
  aliases: ['ratewaifu', 'avaliarwaifu'],
  cooldown: 3,
  guildOnly: true,
  clientPerms: ['READ_MESSAGE_HISTORY'],

  async run(client, message, args) {
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);

    if (!user) {
      return message.reply('lembre-se de mencionar um usuário válido para avaliar!');
    }

    if (user == client.user.id) return message.reply(`${client.emotes.heart} **|** Eu dou nota **∞** para <@737044809650274325> sim eu sou muito linda 😘`);

    const list = [
      '**1** para essa waifu. Eu não gostei <:hmmpepe:791151120021061662> ',
      '**5** para essa waifu. <:hmmpepe:791151120021061662>',
      '**7** para essa waifu. Achei ela bonitinha <:MeowPuffyMelt:776252845493977088> ',
      '**4** para essa waifu. Bonitinha <:hmmpepe:791151120021061662>',
      '**3** para essa waifu. Bonitinha, mas acho que pode melhorar *na minha opinião*',
      '**5** para essa waifu.',
      '**8** para essa waifu.',
      '**10** para essa waifu. Essa waifu é perfeita! Eu não trocaria ela por nada se fosse você! <:meow_blush:768292358458179595>',
    ];

    const rand = list[Math.floor(Math.random() * list.length)];

    await message.reply(`Sobre ${user}... Eu dou nota ${rand}`);
  },
};
