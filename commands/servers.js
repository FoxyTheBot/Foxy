const Discord = require('discord.js')

module.exports.run = async(client, message, channel) => {
 
    message.delete().catch(O_o => {});
 
    message.channel.send("<:nao:749403722488217610> | Este comando foi desativado")
}