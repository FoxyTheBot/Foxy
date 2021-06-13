module.exports = {
  name: 'cancel',
  aliases: ['cancel', 'cancelar'],
  cooldown: 2,
  guildOnly: true,
  clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY'],
  
  async run(client, message, args) {
    const list = [
      'ser velho(a)',
      'ser feio(a)',
      'fazer nada'
    ];

    const rand = list[Math.floor(Math.random() * list.length)];
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) {
      return message.foxyReply('lembre-se de mencionar um usuário válido para cancelar!');
    }
    await message.foxyReply(`${message.author} cancelou ${user} por ${rand}`);
  },

};