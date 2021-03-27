const Discord = require('discord.js');

module.exports = {
  name: 'attack',
  aliases: ['atacar', 'attack'],
  cooldown: 5,
  guildOnly: true,
  async run(client, message, args) {
    const list = [
      'https://cdn.zerotwo.dev/PUNCH/38a3ab62-17f4-4682-873a-121e886d7bce.gif',
      'https://cdn.zerotwo.dev/PUNCH/84c082d0-24e7-491e-bcfc-be03ee46125c.gif',
      'https://cdn.zerotwo.dev/PUNCH/3a5b2598-a973-4e6f-a1d0-9b87a2c35a18.gif',
    ];

    const rand = list[Math.floor(Math.random() * list.length)];
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) {
      return message.reply('lembre-se de mencionar um usuário válido para atacar!');
    }

    const avatar = message.author.displayAvatarURL({ format: 'png' });
    const embed = new Discord.MessageEmbed()
      .setColor('#000000')
      .setDescription(`${message.author} atacou ${user}`)
      .setImage(rand)
      .setTimestamp()
      .setFooter('Reaga com 🌟 para retribuir| Gifs by: ByteAlex#1644')
      .setAuthor(message.author.tag, avatar);
    await message.reply(embed).then((msg) => {
      msg.react('🌟')

      const filter = (reaction, usuario) => reaction.emoji.name === '🌟' && usuario.id === user.id;

      const collector = msg.createReactionCollector(filter, { max: 1, time: 60000 });
      collector.on('collect', () => {
        const repeat = new Discord.MessageEmbed()
          .setColor(client.colors.default)
          .setDescription(`${user} **Atacou** ${message.author}`)
          .setImage(rand)

        message.reply(repeat)
      })

    })
  }

};

