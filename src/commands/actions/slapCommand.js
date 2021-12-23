const Discord = require('discord.js');
const nekoslife = require('nekos.life');

const neko = new nekoslife();
module.exports = {
  name: 'slap',
  aliases: ['slap', 'bater', ' tapa'],
  cooldown: 3,
  guildOnly: true,
  clientPerms: ['ATTACH_FILES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY'],

  async run(client, message) {
    const user = message.mentions.users.first()

    const img = await neko.sfw.slap();
    const img2 = await neko.sfw.slap();

    const foxyslap = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('😡 Como ousa bater numa raposinha como eu >:c')
      .setDescription(`${client.user} deu um tapa bem dado em ${message.author}`)
      .setImage(img.url);

    if (user === client.user) return message.reply(foxyslap);

    const avatar = message.author.displayAvatarURL({ format: 'png' });
    const embed = new Discord.MessageEmbed()
      .setColor('#000000')
      .setDescription(`😱${message.author} **bateu em** ${user}`)
      .setImage(img.url)
      .setTimestamp()
      .setFooter('😱😱')
      .setFooter('Reaja com 😡 para retribuir')
      .setAuthor(message.author.tag, avatar);
    await message.reply(embed).then((msg) => {
      msg.react('😡')

      const filter = (reaction, usuario) => reaction.emoji.name === '😡' && usuario.id === user.id;

      const collector = msg.createReactionCollector(filter, { max: 1, time: 60000 });
      collector.on('collect', () => {
        const repeat = new Discord.MessageEmbed()
          .setColor(client.colors.default)
          .setDescription(`${user} **Bateu em** ${message.author}`)
          .setImage(img2.url)

        message.reply(repeat)
      })

    })
  },

};
