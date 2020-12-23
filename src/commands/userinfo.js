const Discord = require('discord.js')

exports.run = async (client, message, args, level) => {
     message.delete().catch(O_o => {});
  try {
    const user = message.mentions.members.first() || message.member

    const embed = new Discord.MessageEmbed()
      .setTitle(user.user.username)
      .setDescription(`ID: ${user.id}
Nome: ${user.user.tag}
Conta criada em: ${user.user.createdAt}`)
      .setThumbnail(user.user.avatarURL)
      .setColor('#eeeeee')

    message.channel.send(embed)
  } catch (err) {
    message.channel.send(client.errors.genericError + err.stack).catch();
  }
}
