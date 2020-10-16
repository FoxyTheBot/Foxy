const Discord = require("discord.js"); 

exports.run = async (client, message, args) => {

  let embed = new Discord.MessageEmbed() 
    .setColor(`#4cd8b2`) 
    .setTitle(`Me envie para o seu servidor`) 
    .setURL(`https://discord.com/api/oauth2/authorize?client_id=737044809650274325&permissions=8&scope=bot`)
    .setDescription("Meu servidor de suporte: https://discord.gg/54eBJcv")

    .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}));
 await message.channel.send(embed); 

};