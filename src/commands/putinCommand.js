const Discord = require('discord.js');
const webhookClient = new Discord.WebhookClient("WEBHOOK-ID", "WEBHOOK-TOKEN");
module.exports = {
name: "putin",
aliases: ['putin', 'walk'],
cooldown: 3,
guildOnly: false,
async execute(client, message, args) {
  const sayMessage = args.join(' ');
  if (!sayMessage) return message.channel.send('Digite algo antes')
  let embed = new Discord.MessageEmbed()
  .setDescription(sayMessage)
  .setImage('https://media1.tenor.com/images/20af5cca901f8fe316c93174da43c4e8/tenor.gif')
  .setFooter(`Comando solicitado por ${message.author}`)
  await message.channel.send(embed)
  const log = new Discord.MessageEmbed()
      .setTitle('Logs de comandos')
      .setDescription(`**Command:** f!putin \n **Author:** ${message.author.tag} / ${message.author.id} \n\n **Guild** ${message.guild.name} / ${message.guild.id} \n\n **Message:** ${sayMessage} \n\n Link: [Message link](${message.url})`)
  webhookClient.send( {
    username: `Logs`,
    avatarURL: 'https://cdn.discordapp.com/attachments/766414535396425739/789255465125150732/sad.jpeg',
    embeds: [log],
  });
}

}