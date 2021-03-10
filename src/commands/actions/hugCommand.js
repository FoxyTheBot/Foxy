const Discord = require('discord.js');
const nekolife = require('nekos.life');

const neko = new nekolife();
module.exports = {
  name: 'hug',
  aliases: ['hug', 'abraçar'],
  cooldown: 3,
  guildOnly: true,
  async run(client, message, args) {
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) {
      return message.reply('lembre-se de mencionar um usuário válido para abraçar!');
    }

    const img = await neko.sfw.hug();
    const avatar = message.author.displayAvatarURL({ format: 'png' });
    const embed = new Discord.MessageEmbed()
      .setColor('#000000')
      .setDescription(`${message.author} **abraçou** ${user}`)
      .setImage(img.url)
      .setTimestamp()
      .setFooter('Reaja com ❤ para retribuir');
    await message.reply(`${message.author}`, embed).then((msg) => {
      msg.react('❤')

      const filter = (reaction, usuario) => reaction.emoji.name === '❤' && usuario.id === user.id;

      const collector = msg.createReactionCollector(filter, { max: 1, time: 60000});
      collector.on('collect', () => {
        const repeat = new Discord.MessageEmbed()
        .setColor(client.colors.default)
        .setDescription(`😽 ${user} **Abraçou** ${message.author}`)
        .setImage(img.url)
  
        message.reply(repeat)
      })

    })
    }

  }


