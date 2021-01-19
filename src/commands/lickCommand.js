const Discord = require('discord.js');
module.exports = {
name: "lick",
aliases: ['lamber'],
cooldown: 3,
guildOnly: true,
async execute(client, message, args) {
var list = [
  'https://i.pinimg.com/originals/56/42/0d/56420de595681d55e4ea2cc9dcc48db9.gif',
  'https://media1.tenor.com/images/efd46743771a78e493e66b5d26cd2af1/tenor.gif?itemid=14002773',
  'https://media1.tenor.com/images/89ad29ff456763c351ccb1fb35605778/tenor.gif?itemid=15150258'
];

var rand = list[Math.floor(Math.random() * list.length)];
let user = message.mentions.users.first() || client.users.cache.get(args[0]);
if (!user) {
return message.reply('lembre-se de mencionar um usuário válido para lamber!');
}

let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`${message.author} **lambeu** ${user}`)
        .setImage(rand)
        .setTimestamp()
        .setThumbnail(avatar)
        .setFooter('Made with 💖 by WinG4merBR')
        .setAuthor(message.author.tag, avatar);
  await message.channel.send(`${message.author}`, embed);
}

}