const Discord = require('discord.js');
  const nekolife = require('nekos.life')
  const neko = new nekolife();
module.exports = {
name: "hug",
aliases: ['hug', 'abraçar'],
cooldown: 3,
guildOnly: true,
async execute(client, message, args) {
  


let user = message.mentions.users.first() || client.users.cache.get(args[0]);
if (!user) {
return message.reply('lembre-se de mencionar um usuário válido para abraçar!');
}

let img = await neko.sfw.hug()
let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`${message.author} **abraçou** ${user}`)
        .setImage(img.url)
        .setTimestamp()
        .setFooter('Made with 💖 by WinG4merBR')
  await message.channel.send(`${message.author}`, embed)
}

}