const Discord = require("discord.js"); 
const config  = require('../config.json')

exports.run = async (client, message, args) => {

  let embed = new Discord.MessageEmbed() 
    .setColor(`#4cd8b2`) 
    .setTitle(`<:info:718944993741373511> Central de Ajuda <:info:718944993741373511>`) 
    .setDescription("**Moderação** \n f!kick `Expulsa usuario do servidor` \n f!ban `Bane usuário mencionado` \n f!clear `Apaga mensagens no canal` \n f!mute `Muta usuário mencionado` \n f!unmute `Desmuta Usuário` \n f!unban `Desbane usuario` \n **Diversão** \n  f!8ball `Me pergunte algo` \n f!kiss `Mencione alguem para beijar` \n f!say `Você diz... eu repito` \n f!coinflip `Cara ou coroa` \n **Miscelâneas** \n f!servers `Ver minha quantidade de servidores` \n f!invite `Me envie para o seu servidor` \n f!support `Servidor de suporte` \n f!avatar `Sua foto de perfil ou de um user` \n f!bsod `Tela azul D:` \n f!github `GitHub do WinGamer` \n f!botinfo `Sobre mim :D` \n f!crab `CRAB`z \n f!sanduba `Bem aleatorio mesmo`")

    .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}));
 await message.channel.send(embed); 

};
