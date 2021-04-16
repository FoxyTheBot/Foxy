module.exports = {
  name: 'cancel',
  aliases: ['cancel', 'cancelar'],
  cooldown: 2,
  guildOnly: true,
  async run(client, message, args) {
    const list = [
      'ser velho(a)',
      'ser feio(a)',
      'fazer nada',
    ];

    const rand = list[Math.floor(Math.random() * list.length)];
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) {
      return message.FoxyReply('lembre-se de mencionar um usuário válido para cancelar!');
    }
    await message.FoxyReply(`${message.author} cancelou ${user} por ${rand}`);
  },

};