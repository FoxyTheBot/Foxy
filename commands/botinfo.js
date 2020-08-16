const Discord = require("discord.js"); 
const config  = require('../config.json')

exports.run = async (client, message, args) => {

  let embed = new Discord.MessageEmbed() 
    .setColor(`#4cd8b2`) 
    .setTitle(`Sobre o Foxy`) 
    .setDescription("Hospedagem: `Discloud` \n Plano: `Free` \n Linguagem: `JavaScript` \n Banco de dados: `Não` \n Servidores: `Digite f!servers` \n Criador: `WinGamer#1047` \n Discord Package: `V12`")

    .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}));
 await message.channel.send(embed); 

};
