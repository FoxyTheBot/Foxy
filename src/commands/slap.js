const Discord = require('discord.js');

exports.run = async (client, message, args) => {
     
    let user = message.mentions.users.first() || client.users.cache.get(args[0]);
      var list = [
  'https://i.pinimg.com/originals/65/57/f6/6557f684d6ffcd3cd4558f695c6d8956.gif',
  'https://media1.tenor.com/images/b6d8a83eb652a30b95e87cf96a21e007/tenor.gif?itemid=10426943',
          'https://i.pinimg.com/originals/b9/74/54/b97454d61d518852bef17e40703bb3fe.gif',
          'https://media1.tenor.com/images/f9f121a46229ea904209a07cae362b3e/tenor.gif?itemid=7859254',
          'https://media1.tenor.com/images/07b4516d50406b4a320269d514876170/tenor.gif?itemid=17897216',
          'https://i.imgur.com/Agwwaj6.gif'
];

var rand = list[Math.floor(Math.random() * list.length)];
    const foxyslap = new Discord.MessageEmbed()
    .setColor('RED')
    .setTitle('😡 Como ousa bater numa raposinha como eu >:c')
    .setDescription(`${client.user} deu um tapa bem dado em ${message.author}`)
    .setImage(rand)
    
  if (user == client.user) return message.channel.send(foxyslap)

let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`😱${message.author} **bateu em** ${user}`)
        .setImage(rand)
        .setTimestamp()
        .setFooter('😱😱')
        .setAuthor(message.author.tag, avatar);
  await message.channel.send(embed);
}