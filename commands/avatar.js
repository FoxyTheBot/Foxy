<<<<<<< HEAD
const Discord = require("discord.js"); 
const config  = require('../config.json')

exports.run = async (client, message, args) => {

  let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
  
  let avatar = user.avatarURL({ dynamic: true, format: "png", size: 1024 });
  let embed = new Discord.MessageEmbed() 
    .setColor(`#4cd8b2`) 
    .setTitle(`Avatar carregado`)
    .setDescription(`Avatar de ${user}`) 
    .setImage(avatar) 
    .setFooter("Made with 💖 by WinGamer");
 await message.channel.send(embed); 

};
=======
const Discord = require("discord.js"); 
const config  = require('../config.json')

exports.run = async (client, message, args) => {

  let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
  
  let avatar = user.avatarURL({ dynamic: true, format: "png", size: 1024 });
  let embed = new Discord.MessageEmbed() 
    .setColor(`#4cd8b2`) 
    .setTitle(`Avatar carregado`)
    .setDescription(`Avatar de ${user}`) 
    .setImage(avatar) 
    .setFooter("Made with 💖 by WinGamer");
 await message.channel.send(embed); 

};
>>>>>>> 4849578b0c5c2f2bc00528e9d14395b0384702c6
