<<<<<<< HEAD
=======

>>>>>>> 29acc2112f1f1b022c2e185e1f27f7123ef33f38
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
