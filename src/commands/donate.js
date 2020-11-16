const Discord = require('discord.js')

exports.run = async (client, message) => {
    let embed = new Discord.MessageEmbed()
    .setColor('BLUE')
    .setTitle('Doações')
    .setURL('https://www.paypal.com/donate/?hosted_button_id=J7Y747Q38UEKN')
    .setDescription('Me ajude a ficar online doando para mim <a:yay_fast:768292346843889714> \nVocê pode doar para mim clicando em "Doações" \nDoações são feitas via PayPal<:paypal:776965353904930826> mas pode também ser feitas via cartão :3')
    await message.channel.send(embed)
}