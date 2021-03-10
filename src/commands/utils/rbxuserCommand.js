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
    if (!username) return message.reply('Especifique um usuário!');
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

              .addField('<:robloxlogo:804814541631914035> Username', `\`${info.username}\`` || 'Sem solução', true)
              .addField(':computer: User ID', id || 'Sem solução', true)
              .addField(':blue_book: Sobre mim', info.blurb || 'Nada', true)
              .addField(':star: Status', info.status || 'Nada', true)
              .addField(':date: Data de conta', `${info.age} Dias` || 'Sem solução', true)
              .addField(':calendar: Data de registro', `${data}` || 'Sem solução', true)
              .addField('User Link', `https://roblox.com/users/${id}/profile`, true);
            message.reply(embed);
          });
        }


      }).catch((err) => {
        message.reply('Ah! Eu não encontrei este usuário, ou talvez ele não exista, desculpe pela inconveniência!'); // catching error
      });
    } else { message.reply('Por favor especifique um usuário válido'); }
  },
};
