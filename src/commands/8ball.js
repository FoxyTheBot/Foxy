const Discord = require('discord.js')
const config = require('../config.json')

module.exports.run = async (client, message, args) => {
 message.delete().catch(O_o => {});
    let results = ["Sim", "Não", "Talvez", "Com certeza!", "Talvez", "Provavelmente sim", "Provavelmente não", "Não entendi, pergunte novamente"]
    let result = Math.floor((Math.random() * results.length)); {}

    message.channel.send(results[result])}
