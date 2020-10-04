
const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    const sayMessage = args.join(' ');
    message.delete().catch(O_o => {});
var list = [
  'https://cdn.zerotwo.dev/DANCE/62ce61da-ed7c-4a85-b05c-bdea0ec30b29.gif',
  'https://cdn.zerotwo.dev/DANCE/d2178bd6-e3ff-44cf-94e7-a1d98b5f1d47.gif',
  'https://cdn.zerotwo.dev/DANCE/0a95dde7-7cd3-4624-a871-9b4d56bdede4.gif',
  'https://i.pinimg.com/originals/93/c3/a6/93c3a64222249d47097d80f35eca02c4.gif',
  'https://thumbs.gfycat.com/AdeptPoshIberianmidwifetoad-small.gif'
];

var rand = list[Math.floor(Math.random() * list.length)];

let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`${message.author} dançou ` + sayMessage)
        .setImage(rand)
        .setTimestamp()
        .setFooter('Made with 💖 by WinGamer | Gifs by: ByteAlex#1644')
        .setAuthor(message.author.tag, avatar);
  await message.channel.send(embed);
}
