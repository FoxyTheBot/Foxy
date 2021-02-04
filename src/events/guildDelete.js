module.exports = async(guild) => {
    const Discord = require('discord.js')
    const webhookClient = new Discord.WebhookClient("WEBHOOK-ID", "WEBHOOK-TOKEN");
  const embed = new Discord.MessageEmbed()
      .setTitle('Logs de entrada e saída')
      .setDescription(`<:sad_cat_thumbs_up:768291053765525525> Fui removida de um servidor`)
  webhookClient.send( {
      username: `Logs`,
      avatarURL: 'https://cdn.discordapp.com/attachments/766414535396425739/789255465125150732/sad.jpeg',
      embeds: [embed],
  });
}