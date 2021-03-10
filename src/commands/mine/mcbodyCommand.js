module.exports = {
  name: 'mcbody',
  aliases: ['mcbody'],
  cooldown: 5,
  guildOnly: false,

  async run(client, message, args) {
    const user = args.join(' ');
    if (!user) return message.reply('<:Minecraft:804858374780878868> **|** Especifique um usuário');

    const discord = require('discord.js');
    const body = `https://mc-heads.net/body/${user}`;

    const embed = new discord.MessageEmbed()
      .setColor(client.colors.mine)
      .setTitle(`Corpo de ${user}`)
      .setImage(body);
    message.reply(embed);
  },
};
