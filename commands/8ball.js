<<<<<<< HEAD
=======

>>>>>>> 29acc2112f1f1b022c2e185e1f27f7123ef33f38
const Discord = require('discord.js')
const config = require('../config.json')

module.exports.run = async (client, message, args) => {

    let results = ["Sim", "Não", "Talvez", "Com certeza!", "Talvez", "Provavelmente sim", "Provavelmente não", "Não entendi, pergunte novamente"]
    let result = Math.floor((Math.random() * results.length)); {}

    message.channel.send(results[result])}
