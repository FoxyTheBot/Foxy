const Discord = require('discord.js');
const nekoslife = require('nekos.life')
const neko = new nekoslife();
module.exports = {
name: "pat",
aliases: ['pat', 'cafuné'],
cooldown: 3,
guildOnly: true,
async execute(client, message, args) {

  

let user = message.mentions.users.first() || client.users.cache.get(args[0]);
if (!user) {
return message.reply('lembre-se de mencionar um usuário válido para fazer cafuné!');
}

let img = await neko.sfw.pat()

  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`${message.author} **fez cafuné em** ${user}`)
        .setImage(img.url)
        .setTimestamp()
        .setFooter('Made with 💖 by WinG4merBR')
  await message.channel.send(`${message.author}`, embed);
}

}