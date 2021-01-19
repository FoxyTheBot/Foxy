const Discord = require('discord.js');
const client = require('nekos.life')
const neko = new client();
module.exports = {
name: "kiss",
aliases: ['kiss', 'beijar'],
cooldown: 3,
guildOnly: true,
async execute(client, message, args) {
 
  let user = message.mentions.users.first() || client.users.cache.get(args[0]);
  if (!user) {
    return message.reply('lembre-se de mencionar um usuário válido para beijar!');
    }
  if(user == message.author) return message.channel.send('Você não pode se beijar, a não ser que você seja um extraterreste 👽')
  if (user == client.user) return message.channel.send('🙅‍♀️ Nah, eu não quero te beijar')
  
  let img = await neko.sfw.kiss()


  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`${message.author} **beijou** ${user}`)
        .setImage(img.url)
        .setTimestamp()
  await message.channel.send(`${message.author}`, embed);
}

}