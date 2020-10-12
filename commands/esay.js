<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 29acc2112f1f1b022c2e185e1f27f7123ef33f38
const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    if(message.author.id != "708493555768885338") return message.channel.send(`<:Error:718944903886930013> | ${message.author} Apenas pessoas especiais podem usar este comando :3 \n Sua ID: ${message.author.id} não foi encontrada nos meus arquivos.`)
    message.delete().catch(O_o => {});
    const sayMessage = args.join(' ');
    message.channel.send(sayMessage)
<<<<<<< HEAD
=======
=======
const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    if(message.author.id != "708493555768885338") return message.channel.send(`<:Error:718944903886930013> | ${message.author} Apenas pessoas especiais podem usar este comando :3 \n Sua ID: ${message.author.id} não foi encontrada nos meus arquivos.`)
    message.delete().catch(O_o => {});
    const sayMessage = args.join(' ');
    message.channel.send(sayMessage)
>>>>>>> 4849578b0c5c2f2bc00528e9d14395b0384702c6
>>>>>>> 29acc2112f1f1b022c2e185e1f27f7123ef33f38
};