const Discord = require('discord.js');
const client = require('nekos.life');

const neko = new client();

module.exports = {
    name: 'kiss',
  aliases: ['kiss', 'beijar'],
  cooldown: 3,
  guildOnly: true,
  async run(client, message, args) {
    const img = await neko.sfw.kiss();

    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) {
      return message.reply('lembre-se de mencionar um usuário válido para beijar!');
    }

    const embed = new Discord.MessageEmbed()
      .setColor('#000000')
      .setDescription(`${message.author} **beijou** ${user}`)
      .setImage(img.url)
      .setTimestamp();
    await message.channel.send(`${message.author}`, embed);
  },

};
