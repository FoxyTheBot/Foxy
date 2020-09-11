const Discord = require('discord.js');
const config = require('../config.json')

exports.run = async (client, message, args) => {

var list = [
  'namorados <3',
  'amigos :)',
  'casados <3',
  'inimigos >:3',
  'irmãos :3',
  'primos :3'
];

var rand = list[Math.floor(Math.random() * list.length)];
let user = message.mentions.users.first() || client.users.cache.get(args[0]);
if (!user) {
return message.reply('lembre-se de mencionar um usuário válido');
}
  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
	.setTitle(`Em outro universo paralelo 🌀`)
        .setDescription(`${message.author} e ${user} são ${rand}`)
        .setTimestamp()
        .setFooter('Made with 💖 by WinGamer')
  await message.channel.send(embed);
}