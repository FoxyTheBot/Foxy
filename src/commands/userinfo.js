const Discord = require('discord.js')

exports.run = async (client, message, args, level) => {
    const user = message.mentions.members.first() || message.member

    const embed = new Discord.MessageEmbed()
      .setTitle(user.user.username)
      .setDescription(`
<a:MSN_Loading:774800650072227861> ID: ${user.id}
<:DiscordStaff:769246133108080710> Nome: ${user.user.username}
<:info:774801465348587530> Conta criada em: ${user.user.createdAt}
<a:carregando:749403691077074953> Username: ${user.user.tag}`)
      .setThumbnail(user.user.avatarURL)
      .setColor('GREEN')

    message.channel.send(embed)
}
