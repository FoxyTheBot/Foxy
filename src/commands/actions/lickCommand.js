const Discord = require('discord.js');

module.exports = {
  name: 'lick',
  aliases: ['lamber'],
  cooldown: 3,
  guildOnly: true,
  async run(client, message, args) {
    const list = [
      'https://i.pinimg.com/originals/56/42/0d/56420de595681d55e4ea2cc9dcc48db9.gif',
      'https://media1.tenor.com/images/efd46743771a78e493e66b5d26cd2af1/tenor.gif?itemid=14002773',
      'https://media1.tenor.com/images/89ad29ff456763c351ccb1fb35605778/tenor.gif?itemid=15150258',
    ];

    const rand = list[Math.floor(Math.random() * list.length)];
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) {
      return message.FoxyReply('lembre-se de mencionar um usuário válido para lamber!');
    }

    const avatar = message.author.displayAvatarURL({ format: 'png' });
    const embed = new Discord.MessageEmbed()
      .setColor('#000000')
      .setDescription(`${message.author} **lambeu** ${user}`)
      .setImage(rand)
      .setTimestamp()
      .setThumbnail(avatar)
      .setFooter('')
      .setAuthor(message.author.tag, avatar);
    await message.FoxyReply(`${message.author}`, embed).then((msg) => {
      msg.react('😝')

      const filter = (reaction, usuario) => reaction.emoji.name === '😝' && usuario.id === user.id;

      const collector = msg.createReactionCollector(filter, { max: 1, time: 60000 });
      collector.on('collect', () => {
        const repeat = new Discord.MessageEmbed()
          .setColor(client.colors.default)
          .setDescription(`${user} **Lambeu** ${message.author}`)
          .setImage(rand)

        message.FoxyReply(repeat)
      })

    })
  },

};
