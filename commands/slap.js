<<<<<<< HEAD
const Discord = require('discord.js');
const config = require('../config.json')

exports.run = async (client, message, args) => {

var list = [
  'https://image.myanimelist.net/ui/BQM6jEZ-UJLgGUuvrNkYUFk2Ae92E1tAeAfjk_pGLpKnHfWiikue5-m1fMe8_1TjRXlLKNwbrQTs1EfUN5ol3A',
  'https://i.pinimg.com/originals/65/57/f6/6557f684d6ffcd3cd4558f695c6d8956.gif',
  'https://media1.tenor.com/images/b6d8a83eb652a30b95e87cf96a21e007/tenor.gif?itemid=10426943'
];

var rand = list[Math.floor(Math.random() * list.length)];
let user = message.mentions.users.first() || client.users.cache.get(args[0]);
if (!user) {
return message.reply('lembre-se de mencionar um usuário válido para bater!');
}

let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`${message.author} acaba de bater em ${user}`)
        .setImage(rand)
        .setTimestamp()
        .setFooter('😱😱')
        .setAuthor(message.author.tag, avatar);
  await message.channel.send(embed);
=======
const Discord = require('discord.js');
const config = require('../config.json')

exports.run = async (client, message, args) => {

var list = [
  'https://image.myanimelist.net/ui/BQM6jEZ-UJLgGUuvrNkYUFk2Ae92E1tAeAfjk_pGLpKnHfWiikue5-m1fMe8_1TjRXlLKNwbrQTs1EfUN5ol3A',
  'https://i.pinimg.com/originals/65/57/f6/6557f684d6ffcd3cd4558f695c6d8956.gif',
  'https://media1.tenor.com/images/b6d8a83eb652a30b95e87cf96a21e007/tenor.gif?itemid=10426943'
];

var rand = list[Math.floor(Math.random() * list.length)];
let user = message.mentions.users.first() || client.users.cache.get(args[0]);
if (!user) {
return message.reply('lembre-se de mencionar um usuário válido para bater!');
}

let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`${message.author} acaba de bater em ${user}`)
        .setImage(rand)
        .setTimestamp()
        .setFooter('😱😱')
        .setAuthor(message.author.tag, avatar);
  await message.channel.send(embed);
>>>>>>> 4849578b0c5c2f2bc00528e9d14395b0384702c6
}