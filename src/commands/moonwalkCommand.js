const Discord = require('discord.js');

module.exports = {
name: "moonwalk",
aliases: ['moonwalk'],
cooldown: 3,
guildOnly: false,
async execute(client, message, args) {
var list = [
  'https://media.tenor.com/images/8aa75a40a1f4298f98b6176ec2875654/tenor.gif',
  'https://media.tenor.com/images/20ec8644d682704ff5a7c5f7bc917104/tenor.gif'
];

var rand = list[Math.floor(Math.random() * list.length)];

let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`${message.author} Fez o moonwalk`)
        .setImage(rand)
        .setTimestamp()
        .setFooter('Made with 💖 by WinG4merBR')
        .setAuthor(message.author.tag, avatar);
  await message.channel.send(embed);
}

}