<<<<<<< HEAD
const Discord = require('discord.js')
const config = require('../config.json')

module.exports.run = async (client, message, args) => {

    let results = ["Sim", "Não", "Talvez", "Com certeza!", "Talvez", "Provavelmente sim", "Provavelmente não", "Não entendi, pergunte novamente"]
    let result = Math.floor((Math.random() * results.length)); {}

    message.channel.send(results[result])}
=======
const Discord = require('discord.js')
const config = require('../config.json')

module.exports.run = async (client, message, args) => {

    let results = ["Sim", "Não", "Talvez", "Com certeza!", "Talvez", "Provavelmente sim", "Provavelmente não", "Não entendi, pergunte novamente"]
    let result = Math.floor((Math.random() * results.length)); {}

    message.channel.send(results[result])}
>>>>>>> 4849578b0c5c2f2bc00528e9d14395b0384702c6
