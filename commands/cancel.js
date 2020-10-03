<<<<<<< HEAD
const Discord = require('discord.js')

exports.run = async (client, message, args) => {

    var list = [
      'ser velho(a)',
      'ser feio(a)',
      'fazer nada'
    ];
    
    var rand = list[Math.floor(Math.random() * list.length)];
    let user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) {
    return message.reply('lembre-se de mencionar um usuário válido para cancelar!');
    }
      await message.channel.send(`${message.author} cancelou ${user} por ${rand}`);
    }
=======
const Discord = require('discord.js')

exports.run = async (client, message, args) => {

    var list = [
      'ser velho(a)',
      'ser feio(a)',
      'fazer nada'
    ];
    
    var rand = list[Math.floor(Math.random() * list.length)];
    let user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) {
    return message.reply('lembre-se de mencionar um usuário válido para cancelar!');
    }
      await message.channel.send(`${message.author} cancelou ${user} por ${rand}`);
    }
>>>>>>> 4849578b0c5c2f2bc00528e9d14395b0384702c6
