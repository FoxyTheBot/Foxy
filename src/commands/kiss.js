const Discord = require('discord.js');
exports.run = async (client, message, args) => {
 
  let user = message.mentions.users.first() || client.users.cache.get(args[0]);
  if (!user) {
    return message.reply('lembre-se de mencionar um usuário válido para beijar!');
    }
  if(user == message.author) return message.channel.send('Você não pode se beijar, a não ser que você seja um extraterreste 👽')
  if (user == client.user) return message.channel.send('🙅‍♀️ Nah, eu não quero te beijar')
  
var list = [
  'https://media1.tenor.com/images/78095c007974aceb72b91aeb7ee54a71/tenor.gif?itemid=5095865',
  'https://i.pinimg.com/originals/7e/28/71/7e28715f3c114dc720688f1a03abc5f5.gif',
  'https://imgur.com/w1TU5mR.gif',
    'https://thumbs.gfycat.com/WarpedSlightFrigatebird-small.gif',
    'https://64.media.tumblr.com/56614f2adbcecd04ab527ce1a067f297/tumblr_mn64lwbR0w1rsbc8eo1_500.gif',
    'https://cutewallpaper.org/21/anime-girl-kiss/Anime-Girl-GIF-Anime-Girl-Kiss-Discover-Share-GIFs.gif'
];

var rand = list[Math.floor(Math.random() * list.length)];

let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`${message.author} **beijou** ${user}`)
        .setImage(rand)
        .setTimestamp()
        .setAuthor(message.author.tag, avatar);
  await message.channel.send(`${message.author}`, embed);
}