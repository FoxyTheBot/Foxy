<<<<<<< HEAD
const Discord = require("discord.js"); 
const config  = require('../config.json')

exports.run = async (client, message, args) => {

  let embed = new Discord.MessageEmbed() 
    .setColor(`#4cd8b2`) 
    .setTitle(`Sobre o Foxy`)
    .setThumbnail(`https://cdn.discordapp.com/avatars/737044809650274325/64b92e7d5e7fb48e977e1f04ef13369d.png?size=1024`)
    .setDescription(" **Equipe** \n *WinGamer#0001* `708493555768885338` \n *«𝕊𝚛𝚊.𝕄𝚒𝚕𝚔»ツ#5594* `705898500050911285` \n *Arthur_kohler#7264* `417446569852534785` \n *Bis❄#0001* `331243426941239297` \n **Gifs:** \n *ByteAlex#1644* `Zero Two Bot Creator` \n **Editor:** `Visual Studio Code` \n **Linguagem:** `JavaScript` \n **Hospedagem:** `Discloud` \n **Plano:** `Free` \n **Linguagem:** `JavaScript` \n **Banco de dados:** `Não` \n **Servidores:** `Apenas o Desenvolvedor tem acesso a essa info` \n **Criador:** `WinGamer#1047` \n **Discord.js Package:** `V12`")

    .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}));
 await message.channel.send(embed); 

};
=======
const Discord = require("discord.js"); 
const config  = require('../config.json')

exports.run = async (client, message, args) => {

  let embed = new Discord.MessageEmbed() 
    .setColor(`#4cd8b2`) 
    .setTitle(`Sobre o Foxy`)
    .setThumbnail(`https://cdn.discordapp.com/avatars/737044809650274325/64b92e7d5e7fb48e977e1f04ef13369d.png?size=1024`)
    .setDescription(" **Equipe** \n *WinGamer#0001* `708493555768885338` \n *«𝕊𝚛𝚊.𝕄𝚒𝚕𝚔»ツ#5594* `705898500050911285` \n *Arthur_kohler#7264* `417446569852534785` \n *Bis❄#0001* `331243426941239297` \n **Gifs:** \n *ByteAlex#1644* `Zero Two Bot Creator` \n **Editor:** `Visual Studio Code` \n **Linguagem:** `JavaScript` \n **Hospedagem:** `Discloud` \n **Plano:** `Free` \n **Linguagem:** `JavaScript` \n **Banco de dados:** `Não` \n **Servidores:** `Apenas o Desenvolvedor tem acesso a essa info` \n **Criador:** `WinGamer#1047` \n **Discord.js Package:** `V12`")

    .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}));
 await message.channel.send(embed); 

};
>>>>>>> 4849578b0c5c2f2bc00528e9d14395b0384702c6
