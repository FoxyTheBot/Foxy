const Discord = require('discord.js');

module.exports = {
  name: 'emoji',
  aliases: ['emoji', 'emojo'],
  cooldown: 3,
  guildOnly: true,
  async run(client, message, args) {
    if (!args[0]) {
      return message.inlineReply(
        `**${message.author.username}, a sintaxe correta é:** `
        + '`'
        + 'f!emoji nomedoemoji`',
      );
    }
    const emoji = message.guild.emojis.cache.find((emoji) => emoji.name === args[0]);

    if (!emoji) {
      message.inlineReply(
        `\`${args[0]}\` **não é um emoji deste servidor.**`,
      );
    } else if (emoji.animated === true) {
      await message.inlineReply({
        files: [
          {
            attachment: emoji.url,
            name: 'emoji_owo.gif',
          },
        ],
      });
    } else {
      await message.inlineReply({
        files: [
          {
            attachment: emoji.url,
            name: 'emoji_owo.png',
          },
        ],
      });
    }
  },

};
