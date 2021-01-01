const Discord = require('discord.js')

module.exports.run = async (client, message, args) => {
  
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
    module.exports.help = { 
      name: 'cancel',
      aliases: ["cancelar", "cancel", "can"]
    }