const Discord = require("discord.js"); 


module.exports.run = async (client, message, args) => {
  
  let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
  
  let avatar = user.avatarURL({ dynamic: true, format: "png", size: 1024 });
  let embed = new Discord.MessageEmbed() 
    .setColor(`#4cd8b2`) 
    .setTitle(`Avatar carregado`)
    .setDescription(`Avatar de ${user}`) 
    .setImage(avatar) 
    .setFooter("Made with 💖 by WinGamer");
 await message.channel.send(embed); 

};

module.exports.help = { 
  name: 'avatar',
  aliases: ["foto", "avatar", "av", "ft"]
}
