<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 29acc2112f1f1b022c2e185e1f27f7123ef33f38
const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    const sayMessage = args.join(' ');
    message.delete().catch(O_o => {});
var list = [
  'https://cdn.zerotwo.dev/SAD/2c2702a8-04bc-438d-9b86-d76a20a1de22.gif',
  'https://cdn.zerotwo.dev/SAD/fd316a94-f3cc-4819-89b3-5b25b61a1a91.gif',
  'https://cdn.zerotwo.dev/SAD/76f8a4cb-da99-4257-a1d9-17362a1e6086.gif'
];

var rand = list[Math.floor(Math.random() * list.length)];

let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`${message.author} está triste ` + sayMessage)
        .setImage(rand)
        .setTimestamp()
        .setFooter('Made with 💖 by WinGamer | Gifs by: ByteAlex#1644')
        .setAuthor(message.author.tag, avatar);
  await message.channel.send(embed);
<<<<<<< HEAD
=======
=======
const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    const sayMessage = args.join(' ');
    message.delete().catch(O_o => {});
var list = [
  'https://cdn.zerotwo.dev/SAD/2c2702a8-04bc-438d-9b86-d76a20a1de22.gif',
  'https://cdn.zerotwo.dev/SAD/fd316a94-f3cc-4819-89b3-5b25b61a1a91.gif',
  'https://cdn.zerotwo.dev/SAD/76f8a4cb-da99-4257-a1d9-17362a1e6086.gif'
];

var rand = list[Math.floor(Math.random() * list.length)];

let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`${message.author} está triste ` + sayMessage)
        .setImage(rand)
        .setTimestamp()
        .setFooter('Made with 💖 by WinGamer | Gifs by: ByteAlex#1644')
        .setAuthor(message.author.tag, avatar);
  await message.channel.send(embed);
>>>>>>> 4849578b0c5c2f2bc00528e9d14395b0384702c6
>>>>>>> 29acc2112f1f1b022c2e185e1f27f7123ef33f38
}