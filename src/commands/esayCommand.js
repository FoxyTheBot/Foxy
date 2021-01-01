const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
     
    if(message.author.id != "708493555768885338") return message.channel.send(`<:Error:718944903886930013> | ${message.author} Apenas pessoas especiais podem usar este comando :3 \n Sua ID: ${message.author.id} não foi encontrada nos meus arquivos.`)
    
    const sayMessage = args.join(' ');
    message.channel.send(sayMessage)
};

module.exports.help = {
    name: "esay",
	aliases: ["esay"]
}