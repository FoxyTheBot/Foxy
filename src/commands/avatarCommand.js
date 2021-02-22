const Discord = require("discord.js"); 

module.exports = {
  name: "avatar",
  aliases: ['avatar', 'pfp'],
  cooldown: 5,
  guildOnly: false,

async execute(client, message, args) {
  if (!message.guild.me.hasPermission('ATTACH_FILES')) return message.channel.send("Eu preciso da permissão `enviar arquvios` para fazer isso!")

  let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
  
  let avatar = user.avatarURL({ dynamic: true, format: "png", size: 1024 });
  let embed = new Discord.MessageEmbed() 
    .setColor(`#4cd8b2`) 
    .setTitle(`Avatar carregado`)
    .setDescription(`Avatar de ${user}`) 
    .setImage(avatar) 
 await message.channel.send(embed); 

}

}