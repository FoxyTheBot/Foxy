module.exports = async (client, message) => {
  if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) message.channel.send(`Olá ${message.author}! Eu sou a ${client.user.username}! Meu prefixo é ${client.config.prefix}, use ${client.config.prefix}help para obter ajuda ${client.emotes.success}`);
};
