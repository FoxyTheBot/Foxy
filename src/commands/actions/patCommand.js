const Discord = require('discord.js');
const nekoslife = require('nekos.life');

const neko = new nekoslife();
module.exports = {
  name: 'pat',
  aliases: ['pat', 'cafuné'],
  cooldown: 3,
  guildOnly: true,
  clientPerms: ['ATTACH_FILES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY'],

  async run(client, message, args) {
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) {
      return message.reply('lembre-se de mencionar um usuário válido para fazer cafuné!');
    }

    const img = await neko.sfw.pat();
    const img2 = await neko.sfw.pat();

    const embed = new Discord.MessageEmbed()
      .setColor('#000000')
      .setDescription(`${message.author} **fez cafuné em** ${user}`)
      .setImage(img.url)
      .setTimestamp()
      .setFooter('Reaja com 🤩 para retribuir');
    await message.reply(`${message.author}`, embed).then((msg) => {
      msg.react('🤩')

      const filter = (reaction, usuario) => reaction.emoji.name === '🤩' && usuario.id === user.id;

      const collector = msg.createReactionCollector(filter, { max: 1, time: 60000 });
      collector.on('collect', () => {
        const repeat = new Discord.MessageEmbed()
          .setColor(client.colors.default)
          .setDescription(`${user} **Fez cafuné** ${message.author}`)
          .setImage(img2.url)

        message.reply(repeat)
      })

    })
  },

};
