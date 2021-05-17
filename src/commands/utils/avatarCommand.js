const Discord = require('discord.js');

module.exports = {
  name: 'avatar',
  aliases: ['avatar', 'pfp'],
  cooldown: 5,
  guildOnly: false,
  clientPerms: ['EMBED_LINKS', 'READ_MESSAGE_HISTORY'],

  async run(client, message, args) {
    if (!message.guild.me.permissions.has('ATTACH_FILES')) return message.FoxyReply('Eu preciso da permissão `enviar arquvios` para fazer isso!');

    const user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;

    const avatar = user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 });
    const embed = new Discord.MessageEmbed()
      .setColor('#4cd8b2')
      .setTitle(`Avatar de ${user.username}`)
      .setDescription(`Clique [aqui](${avatar}) para baixar o avatar`)
      .setImage(avatar);
    await message.FoxyReply(embed);
  },

};
