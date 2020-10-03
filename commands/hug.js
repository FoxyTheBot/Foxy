<<<<<<< HEAD
const Discord = require('discord.js');
const config = require('../config.json')

exports.run = async (client, message, args) => {

var list = [
  'https://i.imgur.com/wOmoeF8.gif',
  'https://media1.tenor.com/images/43fce3d874179afb2d9d74a7402dcff4/tenor.gif?itemid=17264448',
  'https://thumbs.gfycat.com/WellgroomedVapidKitten-small.gif'
];

var rand = list[Math.floor(Math.random() * list.length)];
let user = message.mentions.users.first() || client.users.cache.get(args[0]);
if (!user) {
return message.reply('lembre-se de mencionar um usuário válido para abraçar!');
}

let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`${message.author} acaba de abraçar ${user}`)
        .setImage(rand)
        .setTimestamp()
        .setFooter('Made with 💖 by WinGamer')
        .setAuthor(message.author.tag, avatar);
  await message.channel.send(embed);
=======
const Discord = require('discord.js');
const config = require('../config.json')

exports.run = async (client, message, args) => {

var list = [
  'https://i.imgur.com/wOmoeF8.gif',
  'https://media1.tenor.com/images/43fce3d874179afb2d9d74a7402dcff4/tenor.gif?itemid=17264448',
  'https://thumbs.gfycat.com/WellgroomedVapidKitten-small.gif'
];

var rand = list[Math.floor(Math.random() * list.length)];
let user = message.mentions.users.first() || client.users.cache.get(args[0]);
if (!user) {
return message.reply('lembre-se de mencionar um usuário válido para abraçar!');
}

let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`${message.author} acaba de abraçar ${user}`)
        .setImage(rand)
        .setTimestamp()
        .setFooter('Made with 💖 by WinGamer')
        .setAuthor(message.author.tag, avatar);
  await message.channel.send(embed);
>>>>>>> 4849578b0c5c2f2bc00528e9d14395b0384702c6
}