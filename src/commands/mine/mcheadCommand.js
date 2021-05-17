module.exports = {
  nome: 'mchead',
  aliases: ['mchead'],
  cooldown: 5,
  guildOnly: false,
  clientPerms: ['ATTACH_FILES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY'],

  async run(client, message, args) {
    const user = args.join(' ');
    if (!user) return message.FoxyReply('<:Minecraft:804858374780878868> **|** Especifique um usuário');

    const discord = require('discord.js');
    if(user.length > 20) return message.FoxyReply('Digite no mínimo 20 caractéres')
    const head = `https://mc-heads.net/head/${user}`;

    const embed = new discord.MessageEmbed()
      .setColor(client.colors.mine)
      .setTitle(`Cabeça de ${user}`)
      .setImage(head);
    message.FoxyReply(embed);
  },
};
