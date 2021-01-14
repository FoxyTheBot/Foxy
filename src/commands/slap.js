const Discord = require('discord.js');
const nekoslife = require('nekos.life')
const neko = new nekoslife();
exports.run = async (client, message, args) => {
     
    let user = message.mentions.users.first() || client.users.cache.get(args[0]);
  
let img = neko.sfw.slap()

    const foxyslap = new Discord.MessageEmbed()
    .setColor('RED')
    .setTitle('😡 Como ousa bater numa raposinha como eu >:c')
    .setDescription(`${client.user} deu um tapa bem dado em ${message.author}`)
    .setImage('https://nekos.life/api/v2/img/slap')
    
  if (user == client.user) return message.channel.send(foxyslap)

let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`😱${message.author} **bateu em** ${user}`)
        .setImage(img.url)
        .setTimestamp()
        .setFooter('😱😱')
        .setAuthor(message.author.tag, avatar);
  await message.channel.send(embed);
}