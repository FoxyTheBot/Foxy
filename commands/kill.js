const Discord = require('discord.js');

exports.run = async (client, message, args) => {

var list = [
  'https://cdn.zerotwo.dev/SHOOT/6906011d-c42b-4b5b-bc1c-61cf38ab7d91.gif',
  'https://cdn.zerotwo.dev/SHOOT/028bfc32-c06b-4295-87a5-7ddaef08d5ef.gif',
  'https://cdn.zerotwo.dev/SHOOT/d531b121-5bf4-43df-a723-f13e90c370c2.gif'
];

var rand = list[Math.floor(Math.random() * list.length)];
let user = message.mentions.users.first() || client.users.cache.get(args[0]);
if (!user) {
return message.reply('lembre-se de mencionar um usuário válido para atirar!');
}

let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`${message.author} acaba de atirar em ${user}`)
        .setImage(rand)
        .setTimestamp()
        .setFooter('Made with 💖 by WinGamer | Gifs by: ByteAlex#1644')
        .setAuthor(message.author.tag, avatar);
  await message.channel.send(embed);
}