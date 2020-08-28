const Discord = require('discord.js');
const config = require('../config.json')

exports.run = async (client, message, args) => {

var list = [
  'de iPhone🤡',
  'Fenix🤡',
  'Nagazap🤡'
];

var rand = list[Math.floor(Math.random() * list.length)];
let user = message.mentions.users.first() || client.users.cache.get(args[0]);
if (!user) {
return message.reply('lembre-se de mencionar um usuário válido para travar!');
}

let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`${message.author} acaba de travar ${user} com a trava ${rand}`)
        .setTimestamp()
        .setImage("https://i.pinimg.com/originals/6f/41/91/6f41910b3f8badbeb7b895b6500ef9c6.png")
        .setFooter('Made with 💖 by WinGamer#1047')
        .setAuthor(message.author.tag, avatar);
  await message.channel.send(embed);
}