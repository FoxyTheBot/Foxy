const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
  name: 'userinfo',
  aliases: ['userinfo'],
  cooldown: 3,
  guildOnly: true,
  clientPerms: ['EMBED_LINKS', 'READ_MESSAGE_HISTORY'],

  async run(client, message) {
    moment.locale('pt-br');
    try {
      const user = message.mentions.members.first() || message.member

      if(!user) return message.reply("Eu não encontrei esse usuário desculpe " + client.emotes.error);
      const usercreate = moment(user.user.createdAt).format('llll');
      const avatar = user.user.avatarURL({ dynamic: true, format: 'png', size: 1024 }); const embed = new Discord.MessageEmbed()
        .setColor('#22a7f2')
        .setTitle(user.user.username)
        .setThumbnail(avatar)
        .addFields(
          { name: ':computer: Discord User:', value: `${user.user.tag}`, inline: true },
          { name: ':date: Conta criada há:', value: `${usercreate}`, inline: true },
          { name: ':bookmark: Discord ID:', value: `\`${user.user.id}\``, inline: true },
        );

      message.reply(`${message.author}`, embed);
    } catch (err) {
      message.reply(client.errors.genericError + err.stack).catch();
    }
  },
};
