const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    const sayMessage = args.join(' ');
    message.delete().catch(O_o => {});
var list = [
  'https://cdn.zerotwo.dev/WASTED/fac47b3a-3267-471a-8bab-662cd7c11e70.gif',
  'https://cdn.zerotwo.dev/WASTED/f57a03fd-9eb3-49e0-979d-627d76f39eb7.gif',
  'https://cdn.zerotwo.dev/WASTED/04f8f44f-b367-4717-b85d-07d7cb00258e.gif'
];

var rand = list[Math.floor(Math.random() * list.length)];

let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`${message.author} morreu ` + sayMessage)
        .setImage(rand)
        .setTimestamp()
        .setFooter('Made with 💖 by WinGamer')
        .setAuthor(message.author.tag, avatar);
  await message.channel.send(embed);
}