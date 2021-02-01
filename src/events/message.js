module.exports = async(client, message) => {
    const { prefix } = require('../config.json')
        if ( message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>` ) message.channel.send(`Olá ${message.author} eu sou a ${client.user.username}! Meu prefixo é ${prefix}, use ${prefix}help para obter ajuda. (Utilize o comando novamente caso não funcione)`)

}