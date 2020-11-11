const Discord = require("discord.js"); 
const config  = require('../config.json')

exports.run = async (client, message, args) => {
  message.delete().catch(O_o => {});

  let embed = new Discord.MessageEmbed() 
    .setColor(`#4cd8b2`) 
    .setTitle(`<:GitHub:746399300728258710> Meu GitHub <:GitHub:746399300728258710>`) 
<<<<<<< HEAD
    .setDescription("https://github.com/BotFoxy/FoxyBot")
=======
    .setDescription("https://github.com/WinG4mer/FoxyBot")
>>>>>>> 7eb0c3cb722b467eb58400c0564efe1eff8eb8f9
    .setThumbnail("https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png")

    
    .setFooter("Made with 💖 by WinGamer");
 await message.channel.send(embed); 

};
