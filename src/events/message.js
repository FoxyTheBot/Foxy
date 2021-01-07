module.exports = async(client, message) => {
    const{ prefix } = require('../json/config.json')
    if ( message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>` ) message.channel.send(`Olá ${message.author} eu sou a Foxy! Meu prefixo é ${prefix}, use f!help para obter ajuda.`)
}