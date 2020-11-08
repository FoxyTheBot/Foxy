const Discord = require('discord.js')

exports.run = async (client, message, args, level) => {
    const user = message.mentions.members.first() || message.member

    const embed = new Discord.MessageEmbed()
      .setTitle(user.user.username)
      .setDescription(`ID: ${user.id}
Nome: ${user.user.username}
Conta criada em: ${user.user.createdAt}
Username: ${user.user.tag}`)
      .setThumbnail(user.user.avatarURL)
      .setColor('GREEN')

    message.channel.send(embed)
}
