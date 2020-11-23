const Discord = require("discord.js"); 
const config  = require('../config.json')

exports.run = async (client, message, args) => {
  message.delete().catch(O_o => {});

  let embed = new Discord.MessageEmbed() 
    .setColor(`#4cd8b2`) 
    .setTitle(`<:GitHub:746399300728258710> Meu GitHub <:GitHub:746399300728258710>`) 
<<<<<<< HEAD
    .setDescription("https://github.com/BotFoxy")
    .setThumbnail("https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png")

    
    .setFooter("Made with 💖 by WinGamer");
=======
    .setDescription("https://github.com/BotFoxy/FoxyBot")
    .setThumbnail("https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png")

    
    .setFooter("Made with 💖 by WinG4merBR");
>>>>>>> fa1949703b749456bfd65b341678577697547e6d
 await message.channel.send(embed); 

};
