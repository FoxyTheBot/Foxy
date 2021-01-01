const Discord = require('discord.js')

module.exports.run = async (client, message, args) => {
 
    let results = ["Sim", "Não", "Talvez", "Com certeza!", "Talvez", "Provavelmente sim", "Provavelmente não", "Não entendi, pergunte novamente"]
    let result = Math.floor((Math.random() * results.length)); {}

    message.channel.send(results[result])
   }
   module.exports.help = { 
      name: '8ball',
      aliases: ["8", "ball", "bolamagica", "8ball"]
    }
