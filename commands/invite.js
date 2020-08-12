const Discord = require('discord.js')
const config = require('../config.json');

module.exports.run = async (client, message, args) => {
    message.channel.send("Me adicione nesse link \n https://discord.com/api/oauth2/authorize?client_id=737044809650274325&permissions=8&scope=bot");
  };