const Discord = require('discord.js');
const client = require('nekos.life')
const neko = new client();
exports.run = async (client, message, args) => {
 
  let user = message.mentions.users.first() || client.users.cache.get(args[0]);
  if (!user) {
    return message.reply('lembre-se de mencionar um usuário válido para beijar!');
    }
  if(user == message.author) return message.channel.send('Você não pode se beijar, a não ser que você seja um extraterreste 👽')
  if (user == client.user) return message.channel.send('🙅‍♀️ Nah, eu não quero te beijar')
  
  let img = await neko.sfw.kiss()


let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`${message.author} **beijou** ${user}`)
        .setImage(img.url)
        .setTimestamp()
        .setAuthor(message.author.tag, avatar);
  await message.channel.send(`${message.author}`, embed);
}