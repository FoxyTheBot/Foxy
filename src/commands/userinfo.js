const Discord = require('discord.js')

exports.run = async (client, message, args, level) => {
  try {
    const user = message.mentions.members.first() || message.member

    const embed = new Discord.RichEmbed()
      .setTitle(user.user.username)
      .setDescription(`ID: ${user.id}
Nome: ${user.user.username}
Conta criada em: ${user.user.createdAt}
Username: ${user.user.tag}`)
      .setThumbnail(user.user.avatarURL)
      .setColor('#eeeeee')

    message.channel.send(embed)
  } catch (err) {
    message.channel.send(client.errors.genericError + err.stack).catch();
  }
}
