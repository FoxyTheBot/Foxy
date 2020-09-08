const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  const sayMessage = args.join(' ');
  message.delete().catch(O_o => {});
  let embed = new Discord.MessageEmbed()
  .setDescription(sayMessage)
  .setImage('https://media1.tenor.com/images/20af5cca901f8fe316c93174da43c4e8/tenor.gif')
  await message.channel.send(embed)
};