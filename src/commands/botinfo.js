const Discord = require("discord.js"); 
const config  = require('../config.json')

exports.run = async (client, message, args) => {
  message.delete().catch(O_o => {});
  let embed = new Discord.MessageEmbed() 
    .setColor(`#4cd8b2`) 
    .setTitle(`Sobre o Foxy`)
    .setThumbnail(`https://cdn.discordapp.com/avatars/737044809650274325/64b92e7d5e7fb48e977e1f04ef13369d.png?size=1024`)
    .setDescription(" **Equipe** \n *WinGamer#4285* `708493555768885338` \n *ThierrY#6303* `756900957270442054` \n *! Arthur#7264* `417446569852534785` \n *Bis❄#0001* `331243426941239297` \n **Gifs:** \n *ByteAlex#1644* `Zero Two Bot Creator` \n **Editor:** `Visual Studio Code` \n **Linguagem:** `JavaScript` \n **Hospedagem:** `Discloud` \n **Plano:** `Free` \n **Linguagem:** `JavaScript` \n **Banco de dados:** `Não` \n **Servidores:** `Apenas o Desenvolvedor tem acesso a essa info` \n **Criador:** `WinGamer#4285` \n **Discord.js Package:** `V12`")

    .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}));
 await message.channel.send(embed); 

};
