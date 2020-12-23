const Discord = require('discord.js')

exports.run = async (client, message) => {
     message.delete().catch(O_o => {});
    let nitro = new Discord.MessageEmbed()
.setColor('PURPLE')
.setTitle('Discord Nitro')
.setDescription('Compre Discord Nitro em https://discord.com/nitro')
    await message.channel.send(nitro)
}