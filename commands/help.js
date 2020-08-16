const Discord = require("discord.js"); 
const config  = require('../config.json')

exports.run = async (client, message, args) => {

  let embed = new Discord.MessageEmbed() 
    .setColor(`#4cd8b2`) 
    .setTitle(`Central de Ajuda`) 
    .setDescription("f!ban `Bane o usuario`\n f!coinflip `Cara ou coroa?` \n f!kick `Expulsa usuário do servidor` \n f!mute `Silencia o usuário` \n f!help `Mostra essa mensagem` \n f!support `Mostra meu servidor de suporte` \n f!uptime `Verifica o tempo ativo` \n f!say `Você diz, eu repito` \n f!invite `me envie para o seu servidor!` \n f!github `Mostra o github de WinGamer` \n f!clear `limpa mensagens no canal` \n f!unban `desbane usuario mencionado` \n f!antimalware `É uma lista de comandos, que te ajuda a se prevenir de ataques, ou espionagem` \n f!8ball <pergunta> `Quer saber se sim, não ou com certeza? Pergunte para mim` \n f!love `Conselhos amorosos do Foxy` \n f!kiss `Mencione alguém para beijar` \n f!avatar `Ver ou baixar o avatar do usuário mencionado` \n f!botinfo `Mostra minhas informações`")

    .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({format: "png"}));
 await message.channel.send(embed); 

};
