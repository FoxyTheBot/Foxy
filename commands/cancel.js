const Discord = require('discord.js')

exports.run = async (client, message, args) => {

    var list = [
      'velho(a)',
      'feio(a)',
      'corno(a)',
      'idiota'
    ];
    
    var rand = list[Math.floor(Math.random() * list.length)];
    let user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) {
    return message.reply('lembre-se de mencionar um usuário válido para cancelar!');
    }
      await message.channel.send(`${message.author} cancelou ${user} por ser ${rand}`);
    }
