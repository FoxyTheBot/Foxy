<<<<<<< HEAD
const Discord = require('discord.js');
const config = require('../config.json')

exports.run = async (client, message, args) => {

var list = [
  'https://cdn.zerotwo.dev/PUNCH/38a3ab62-17f4-4682-873a-121e886d7bce.gif',
  'https://cdn.zerotwo.dev/PUNCH/84c082d0-24e7-491e-bcfc-be03ee46125c.gif',
  'https://cdn.zerotwo.dev/PUNCH/3a5b2598-a973-4e6f-a1d0-9b87a2c35a18.gif'
];

var rand = list[Math.floor(Math.random() * list.length)];
let user = message.mentions.users.first() || client.users.cache.get(args[0]);
if (!user) {
return message.reply('lembre-se de mencionar um usuário válido para atacar!');
}

let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`${message.author} atacou ${user}`)
        .setImage(rand)
        .setTimestamp()
        .setFooter('Made with 💖 by WinGamer | Gifs by: ByteAlex#1644')
        .setAuthor(message.author.tag, avatar);
  await message.channel.send(embed);
=======
const Discord = require('discord.js');
const config = require('../config.json')

exports.run = async (client, message, args) => {

var list = [
  'https://cdn.zerotwo.dev/PUNCH/38a3ab62-17f4-4682-873a-121e886d7bce.gif',
  'https://cdn.zerotwo.dev/PUNCH/84c082d0-24e7-491e-bcfc-be03ee46125c.gif',
  'https://cdn.zerotwo.dev/PUNCH/3a5b2598-a973-4e6f-a1d0-9b87a2c35a18.gif'
];

var rand = list[Math.floor(Math.random() * list.length)];
let user = message.mentions.users.first() || client.users.cache.get(args[0]);
if (!user) {
return message.reply('lembre-se de mencionar um usuário válido para atacar!');
}

let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`${message.author} atacou ${user}`)
        .setImage(rand)
        .setTimestamp()
        .setFooter('Made with 💖 by WinGamer | Gifs by: ByteAlex#1644')
        .setAuthor(message.author.tag, avatar);
  await message.channel.send(embed);
>>>>>>> 4849578b0c5c2f2bc00528e9d14395b0384702c6
}