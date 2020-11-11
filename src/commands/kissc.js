const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  message.delete().catch(O_o => {});
var list = [
  'https://media1.tenor.com/images/65a63a319a598ac908960bfc4b6f89ff/tenor.gif',
  'https://i.imgur.com/Rg9mwvf.gif',
  'https://i.imgur.com/jNWQvTO.gif',
   'https://media1.tenor.com/images/40711a5b00fcf9918ddef1aa483d993f/tenor.gif?itemid=11737410',
    'https://media1.tenor.com/images/40711a5b00fcf9918ddef1aa483d993f/tenor.gif?itemid=11737410'
];

var rand = list[Math.floor(Math.random() * list.length)];
let user = message.mentions.users.first() || client.users.cache.get(args[0]);
if (!user) {
return message.reply('lembre-se de mencionar um usuário válido para beijar!');
}

let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription(`${message.author} beijou o rosto de ${user}`)
        .setImage(rand)
        .setTimestamp()
        .setFooter('Made with 💖 by WinGamer')
        .setAuthor(message.author.tag, avatar);
  await message.channel.send(embed);
}