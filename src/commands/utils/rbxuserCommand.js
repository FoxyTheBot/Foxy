module.exports = {
  name: 'rbxuser',
  aliases: ['rbxuser', 'rbuser', 'robloxuser', 'robloxu', 'rbuser'],
  cooldown: 5,
  guildOnly: true,

  async run(client, message, args) {
    const discord = require('discord.js');
    const roblox = require('noblox.js');
    const moment = require('moment');

    const username = args[0];
    if (!username) return message.inlineReply('Especifique um usuário!');
    if (username) {
      roblox.getIdFromUsername(username).then((id) => {
        if (id) {
          roblox.getPlayerInfo(parseInt(id)).then((info) => {
            moment.locale('pt-br');
            const date = new Date(info.joinDate);
            const data = moment(date).format('LL');

            const embed = new discord.MessageEmbed()
              .setTitle(info.username)
              .setColor('e2231a')
              .setThumbnail(`https://www.roblox.com/bust-thumbnail/image?userId=${id}&width=420&height=420&format=png`)
              .addFields(
                { name: "<:robloxlogo:804814541631914035> Username", value: `\`${info.username}\``, inline: true },
                { name: ":computer: User ID", value: id || "Sem solução", inline: true },
                { name: ":blue_book: Sobre mim", value: info.blurb || 'Nada', inline: true },
                { name: ":star: Status", value: info.status || 'Nada', inline: true },
                { name: ":date: Data da Conta", value: `${info.age} Dias` || 'Sem solução', inline: true },
                { name: ':calendar: Data de registro', value: data || 'Sem solução', inline: true },
                { name: "Link do usuário", value: `https://roblox.com/users/${id}/profile`, inline: true }
              )
            message.inlineReply(embed);
          });
        }


      }).catch((err) => {
        message.inlineReply('Ah! Eu não encontrei este usuário, ou talvez ele não exista, desculpe pela inconveniência!');
      });
    } else { message.inlineReply('Por favor especifique um usuário válido'); }
  },
};
