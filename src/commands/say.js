const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  const sayMessage = args.join(' ');
  message.channel.send(`${sayMessage} \n<:catthumb:768292477555572736> *Mensagem enviada por ${message.author}*`)
  console.log(`User: ${message.author.tag} ID: ${message.author.id} disse "${sayMessage}" no servidor ${message.guild.name} ID: ${message.guild.id}`)
};