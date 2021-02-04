const Discord = require('discord.js')
const moment = require('moment')
module.exports = {
  name: "userinfo",
  aliases: ['userinfo'],
  cooldown: 3,
guildOnly: true,
  async execute(client, message, args, level) {

    moment.locale('pt-br');
  try {
    const user = message.mentions.members.first() || message.member
    const usercreate = moment(user.user.createdAt).format('llll')
    let avatar = user.user.avatarURL();
    const embed = new Discord.MessageEmbed()
      .setColor('#22a7f2')
      .setTitle(user.user.username)
      .setThumbnail(avatar)
      .addFields(
        {name: ":computer: Discord User:", value: `${user.user.tag}`, inline: true},
        {name: ":date: Conta criada há:", value: `${usercreate}`, inline: true},
        {name: ":bookmark: Discord ID:", value: `\`${user.user.id}\``, inline: true},
      )

    message.channel.send(embed)
  } catch (err) {
    message.channel.send(client.errors.genericError + err.stack).catch();
  }
}
}
