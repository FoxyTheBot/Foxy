const Discord = require('discord.js');

module.exports = {
  name: 'github',
  aliases: ['git', 'github'],
  cooldown: 3,
  guildOnly: false,
  clientPerms: ['EMBED_LINKS', 'READ_MESSAGE_HISTORY'],

  async run(client, message, args) {
    const embed = new Discord.MessageEmbed()
      .setColor('#4cd8b2')
      .setTitle('<:GitHub:746399300728258710> Meu GitHub <:GitHub:746399300728258710>')
      .setDescription('https://github.com/BotFoxy')
      .setThumbnail('https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png');

    await message.FoxyReply(embed);
  },
};
