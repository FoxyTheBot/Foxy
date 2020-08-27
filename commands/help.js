const Discord = require("discord.js"); 
const config  = require('../config.json')

exports.run = async (client, message, args) => {

  let embed = new Discord.MessageEmbed() 
    .setColor(`#4cd8b2`) 
    .setTitle(`<:info:718944993741373511> Ajuda do Foxy <:info:718944993741373511>`) 
    .setDescription("**Moderação** \n f!kick `Expulsa usuario do servidor` \n f!ban `Bane usuário mencionado` \n f!clear `Apaga mensagens no canal` \n f!mute `Muta usuário mencionado` \n f!unmute `Desmuta Usuário` \n f!unban `Desbane usuario` \n **Diversão** \n  f!8ball `Me pergunte algo` \n f!say `Você diz... eu repito` \n f!coinflip `Cara ou coroa` \n **RolePlay** \n f!kiss `Mencione alguem para beijar` \n f!hug `Mencione alguem para abraçar` \n f!pat `Mencione alguem para fazer cafuné` \n f!trava `Trave o zap de alguem >:3` \n f!lick `Mencione alguem para lamber` \n f!slap `Mencione alguem para bater` \n **Miscelâneas** \n f!cancel `cancele um usuario` \n f!invite `Me envie para o seu servidor` \n f!avatar `Sua foto de perfil ou de um user` \n f!github `GitHub do WinGamer` \n f!botinfo `Sobre mim :D` \n f!crab `CRAB`")

    
    .setFooter("Made with 💖 by WinGamer#1047");
 await message.channel.send(embed); 

};
