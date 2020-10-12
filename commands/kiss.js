<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 29acc2112f1f1b022c2e185e1f27f7123ef33f38
const Discord = require('discord.js');
const config = require('../config.json')

exports.run = async (client, message, args) => {

var list = [
  'https://media1.tenor.com/images/78095c007974aceb72b91aeb7ee54a71/tenor.gif?itemid=5095865',
  'https://i.pinimg.com/originals/7e/28/71/7e28715f3c114dc720688f1a03abc5f5.gif',
  'https://imgur.com/w1TU5mR.gif'
];

var rand = list[Math.floor(Math.random() * list.length)];
let user = message.mentions.users.first() || client.users.cache.get(args[0]);
if (!user) {
return message.reply('lembre-se de mencionar um usuário válido para beijar!');
}

let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`${message.author} acaba de beijar ${user}`)
        .setImage(rand)
        .setTimestamp()
        .setFooter('Made with 💖 by WinGamer')
        .setAuthor(message.author.tag, avatar);
  await message.channel.send(embed);
<<<<<<< HEAD
=======
=======
const Discord = require('discord.js');
const config = require('../config.json')

exports.run = async (client, message, args) => {

var list = [
  'https://media1.tenor.com/images/78095c007974aceb72b91aeb7ee54a71/tenor.gif?itemid=5095865',
  'https://i.pinimg.com/originals/7e/28/71/7e28715f3c114dc720688f1a03abc5f5.gif',
  'https://imgur.com/w1TU5mR.gif'
];

var rand = list[Math.floor(Math.random() * list.length)];
let user = message.mentions.users.first() || client.users.cache.get(args[0]);
if (!user) {
return message.reply('lembre-se de mencionar um usuário válido para beijar!');
}

let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`${message.author} acaba de beijar ${user}`)
        .setImage(rand)
        .setTimestamp()
        .setFooter('Made with 💖 by WinGamer')
        .setAuthor(message.author.tag, avatar);
  await message.channel.send(embed);
>>>>>>> 4849578b0c5c2f2bc00528e9d14395b0384702c6
>>>>>>> 29acc2112f1f1b022c2e185e1f27f7123ef33f38
}