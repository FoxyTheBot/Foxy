const Discord = require("discord.js"); 
const prefix  = require('../config.json')
const botowner = require('../config.json')
const tag = require('../config.json')

exports.run = async (client, message, args) => {

  let embed = new Discord.MessageEmbed() 
    .setColor(`#4cd8b2`) 
    .setTitle(`Sobre o Foxy`)
    .addField(`Servidores:${client.guilds.cache.size}`)
    .addField(`Prefixo:`, `${prefix}`)
    .addField(`Usuários:`,`${client.users.cache.size}`)
    .addField(`Desenvolvedor`, `${tag}`, `${botowner}`)
    .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}));
 await message.channel.send(embed); 

};
