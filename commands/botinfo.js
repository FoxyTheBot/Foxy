const Discord = require("discord.js"); 
const config  = require('../config.json')

exports.run = async (client, message, args) => {

  let embed = new Discord.MessageEmbed() 
    .setColor(`#4cd8b2`) 
    .setTitle(`Sobre o Foxy`) 
    .setDescription("<a:windows95:711191736764071937> Hospedagem: `Discloud` \n <:DiscordStaff:731947814246154240> Plano: `Free` \n <:DiscordDeveloper:731945244983034033> Linguagem: `JavaScript` \n <a:minechest:728388524360990792> Banco de dados: `Não` \n <:DiscordPartner:731945214494900264> Servidores: `Apenas o Desenvolvedor tem acesso a essa info` \n <:DiscordStaff:731947814246154240> Criador: `WinGamer#1047` \n <:DiscordStaff:731947814246154240> Discord Package: `V12`")

    .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}));
 await message.channel.send(embed); 

};
