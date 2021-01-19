const Discord = require('discord.js')

module.exports = {
  name: "userinfo",
  aliases: ['userinfo'],
  cooldown: 3,
guildOnly: true,
  async execute(client, message, args, level) {

  try {
    const user = message.mentions.members.first() || message.member

    const embed = new Discord.MessageEmbed()
      .setColor('#22a7f2')
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
}
