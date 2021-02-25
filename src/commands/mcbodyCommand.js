const colors = require('../structures/color');

module.exports = {
  name: 'mcbody',
  aliases: ['mcbody'],
  cooldown: 5,
  guildOnly: false,

  async run(client, message, args) {
    const user = args.join(' ');
    if (!user) return message.channel.send('<:Minecraft:804858374780878868> **|** Especifique um usuário');

    const discord = require('discord.js');
    const body = `https://mc-heads.net/body/${user}`;

    const embed = new discord.MessageEmbed()
      .setColor(colors.mine)
      .setTitle(`Corpo de ${user}`)
      .setImage(body);
    message.channel.send(embed);
  },
};
