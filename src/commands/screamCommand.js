const Discord = require('discord.js');

module.exports = {
name: "scream",
aliases: ['scream', 'gritar'],
cooldown: 3,
guildOnly: false,
async execute(client, message, args) {
    const sayMessage = args.join(' ');
var list = [
    'https://media1.tenor.com/images/323accb4d3c53c7202305f5f32225713/tenor.gif?itemid=11222953',
  'https://i.gifer.com/3HKT.gif'
];

var rand = list[Math.floor(Math.random() * list.length)];

let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`${message.author} gritou ` + sayMessage)
        .setImage(rand)
        .setTimestamp()
        .setFooter('Made with 💖 by WinG4merBR')
        .setAuthor(message.author.tag, avatar);
  await message.channel.send(embed);
}

}