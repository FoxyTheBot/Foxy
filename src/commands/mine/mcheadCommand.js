module.exports = {
  nome: 'mchead',
  aliases: ['mchead'],
  cooldown: 5,
  guildOnly: false,

  async run(client, message, args) {
    const user = args.join(' ');
    if (!user) return message.reply('<:Minecraft:804858374780878868> **|** Especifique um usuário');

    const discord = require('discord.js');
    if(user.length > 20) return message.reply('Digite no mínimo 20 caractéres')
    const head = `https://mc-heads.net/head/${user}`;

    const embed = new discord.MessageEmbed()
      .setColor(client.colors.mine)
      .setTitle(`Cabeça de ${user}`)
      .setImage(head);
    message.reply(embed);
  },
};
