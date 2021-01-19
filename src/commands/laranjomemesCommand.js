const Discord = require('discord.js');

module.exports = {
name: "laranjomemes",
aliases: ['laranjomemes', 'laranjom'],
cooldown: 5,
guildOnly: false,
async execute(client, message, args) {
var list = [
    'https://images3.memedroid.com/images/UPLOADED291/5aa6b3b6ead71.jpeg',
  'https://i.pinimg.com/236x/d1/1e/9f/d11e9f2ae80b1efa7a5a18bf8042b1d9.jpg',
  'https://i.pinimg.com/originals/25/55/ab/2555abfe2ce48c4013240729406e5192.png',
  'https://i.pinimg.com/originals/ae/f5/5d/aef55d209f56418510766eaa4029fdb2.jpg',
  'https://images3.memedroid.com/images/UPLOADED81/59dc5b5d02b55.jpeg',
  'https://cdn.dicionariopopular.com/imagens/laranjo5-cke.jpg',
  'https://img.utdstc.com/icons/super-laranjo-run-android.png:225',
  'https://static.quizur.com/i/b/5848c639d92db0.863009505848c639c16d13.55532254.jpg',
  'https://uploads.spiritfanfiction.com/fanfics/historias/201801/limanjo-laranjo-x-limao-11904423-310120181316.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSvTpypaEUy1mX9zGuVmbNY1nEn-4YZ57ODvQ&usqp=CAU',
  'https://pics.me.me/ai-cnoow-iu-sou-nou-sou-nou-laranjo-kkkk-39214407.png',
  'https://i.pinimg.com/564x/b7/15/c3/b715c31dee8d7a70c5b406349b245510.jpg',
  'https://static.imgs.app/content/assetz/uploads/2019/04/843-memes-meme-laranjo-caguei-para-vocee.jpg',
  'https://i.pinimg.com/236x/e7/5e/ac/e75eace64b2dd4d890c4d03231b9f248.jpg',
  'https://i.pinimg.com/564x/86/a5/06/86a5068d11f4db8c790e3178c275bbc9.jpg'
];

var rand = list[Math.floor(Math.random() * list.length)];

let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('ORANGE')
        .setDescription(`Supimpa!`)
        .setImage(rand)
        .setTimestamp()
        .setFooter('Made with 💖 by WinG4merBR')
        .setAuthor(message.author.tag, avatar);
  await message.channel.send(embed);
}

}