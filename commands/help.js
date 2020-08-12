const Discord = require('discord.js')
const config = require('../config.json');

module.exports.run = async (client, message, args) => {
    message.channel.send("```Central de ajuda``` \n f!ban `Bane o usuario`\n f!coinflip `Cara ou coroa?` \n f!kick `Expulsa usuário do servidor` \n f!mute `Silencia o usuário` \n f!help `Mostra essa mensagem` \n f!support `Mostra meu servidor de suporte` \n f!uptime `Verifica o tempo ativo` \n f!say `Você diz, eu repito` \n f!invite `me envie para o seu servidor!` \n f!github `Mostra o github de WinGamer` \n f!clear `limpa mensagens no canal` \n f!unban `desbane usuario mencionado` \n f!antimalware `É uma lista de comandos, que te ajuda a se prevenir de ataques, ou espionagem` ")
};