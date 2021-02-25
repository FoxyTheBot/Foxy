const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
  name: 'date',
  aliases: ['date', 'data'],
  cooldown: 3,
  guildOnly: false,
  async run(client, message, args) {
    moment.locale('pt-br');
    const data = moment().format('LL');
    const hour = moment().format('LT');

    const date = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Data e Hora')
      .addFields(
        { name: ':alarm_clock: Data', value: `${data}`, inline: true },
        { name: ':calendar: Hora', value: `${hour}`, inline: true },
      );
    await message.channel.send(date);
  },

};
