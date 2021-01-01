const Discord = require('discord.js')

module.exports.run = async (client, message) => {
     
    let nitro = new Discord.MessageEmbed()
.setColor('PURPLE')
.setTitle('Discord Nitro')
.setDescription('Compre Discord Nitro em https://discord.com/nitro')
    await message.channel.send(nitro)
}

module.exports.help = {
    name: "nitro",
  aliases: ["nitro", "discordnitro"]
  }