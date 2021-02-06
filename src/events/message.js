module.exports = async (client, message) => {
    const { prefix } = require('../../config.json');
    if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) message.channel.send(`Olá ${message.author}, eu sou a ${client.user.username}! Use ${prefix}help para obter ajuda <:meow_blush:768292358458179595>`);
}