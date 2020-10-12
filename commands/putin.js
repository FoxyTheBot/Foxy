<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 29acc2112f1f1b022c2e185e1f27f7123ef33f38
const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  const sayMessage = args.join(' ');
  message.delete().catch(O_o => {});
  let embed = new Discord.MessageEmbed()
  .setDescription(sayMessage)
  .setImage('https://media1.tenor.com/images/20af5cca901f8fe316c93174da43c4e8/tenor.gif')
  await message.channel.send(embed)
<<<<<<< HEAD
=======
=======
const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  const sayMessage = args.join(' ');
  message.delete().catch(O_o => {});
  let embed = new Discord.MessageEmbed()
  .setDescription(sayMessage)
  .setImage('https://media1.tenor.com/images/20af5cca901f8fe316c93174da43c4e8/tenor.gif')
  await message.channel.send(embed)
>>>>>>> 4849578b0c5c2f2bc00528e9d14395b0384702c6
>>>>>>> 29acc2112f1f1b022c2e185e1f27f7123ef33f38
};