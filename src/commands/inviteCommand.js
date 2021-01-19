const Discord = require("discord.js"); 

module.exports = {
name: "invite",
aliases: ['invite', 'add', 'convidar', 'addbot'],
cooldown: 3,
guildOnly: false,
async execute(client, message, args) {
  
  let embed = new Discord.MessageEmbed() 
    .setColor(`#4cd8b2`) 
    .setDescription("Você quer me adicionar em outros servidores/guilds do Discord? \n Então [clique aqui](https://discord.com/oauth2/authorize?client_id=737044809650274325&permissions=8&scope=bot) para me adicionar em outro servidor! \n Caso precise obter suporte entre no meu servidor de suporte [clicando aqui](https://discord.gg/nHVqcxrFmg) \n\n || A permissão é de administrador, mas eu acho que você confia em mim :D || ")

    .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}));
 await message.channel.send(embed); 

}

}