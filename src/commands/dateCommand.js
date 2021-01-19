const Discord = require('discord.js')
const moment = require('moment')
module.exports = {
name: "date",
aliases: ['date','data'],
cooldown: 3,
guildOnly: false,
async execute(client, message, args) {
    const language = args.join(' ');
    let local = moment.locale(language);
    let data = moment().format('LL');
    let hour = moment().format('LT');
    const noargs = new Discord.MessageEmbed()
.setColor('BLUE')
.setTitle('Como usar')
.setDescription('💁‍♀️ **Exemplo:** `f!date pt-br` \n 🛑 **Argumentos** `en`, `pt`, `en`, `fr`, `ko`, `pt-br`')
if (!language) return message.channel.send(noargs)
    let date = new Discord.MessageEmbed()
    .setColor('RED')
    .setTitle('Data e Hora')
    .addFields(
    { name: ':alarm_clock: Data', value: `${data}`, inline: true },
    { name: ':calendar: Hora', value: `${hour}`, inline: true }
)
await message.channel.send(date)
}

}