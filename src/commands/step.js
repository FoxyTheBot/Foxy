const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  message.delete().catch(O_o => {});
var list = [
	'https://media1.tenor.com/images/577ecef137a88a9149f375d225724b34/tenor.gif?itemid=15524285',
    'https://i.imgur.com/jNWQvTO.gifhttps://media1.tenor.com/images/4ba29ae0be8524550e9f2b88e39ffa9f/tenor.gif?itemid=13091153',
    'https://media1.tenor.com/images/47e776592b6a231acc06826330ab7a45/tenor.gif?itemid=13894493'
];

var rand = list[Math.floor(Math.random() * list.length)];
let user = message.mentions.users.first() || client.users.cache.get(args[0]);
if (!user) {
return message.reply('lembre-se de mencionar um usuário válido para pisar!');
}

let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription(`${message.author} pisou em ${user}`)
        .setImage(rand)
        .setTimestamp()
        .setFooter('Made with 💖 by WinGamer')
        .setAuthor(message.author.tag, avatar);
  await message.channel.send(embed);
}