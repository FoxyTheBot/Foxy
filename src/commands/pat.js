const Discord = require('discord.js');
const config = require('../config.json')

exports.run = async (client, message, args) => {

  message.delete().catch(O_o => {});

  var list = [
  'https://i.pinimg.com/originals/2e/27/d5/2e27d5d124bc2a62ddeb5dc9e7a73dd8.gif',
  'https://i.imgur.com/4ssddEQ.gif',
  'https://giffiles.alphacoders.com/187/187369.gif'
];

var rand = list[Math.floor(Math.random() * list.length)];
let user = message.mentions.users.first() || client.users.cache.get(args[0]);
if (!user) {
return message.reply('lembre-se de mencionar um usuário válido para fazer cafuné!');
}

let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`${message.author} **fez cafuné em** ${user}`)
        .setImage(rand)
        .setTimestamp()
        .setFooter('Made with 💖 by WinGamer')
        .setAuthor(message.author.tag, avatar);
  await message.channel.send(`${message.author}`, embed);
}