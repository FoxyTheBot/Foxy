
module.exports = {
  name: 'ppt',
  aliases: ['ppt'],
  cooldown: 3,
  guildOnly: false,
  clientPerms: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],

  async run(client, message, args) {
    const acceptedReplies = ['pedra', 'papel', 'tesoura'];
    const random = Math.floor((Math.random() * acceptedReplies.length));
    const result = acceptedReplies[random];

    const choice = args[0];
    if (!choice) return message.reply(`Como jogar \`${client.config.prefix}ppt <pedra|papel|tesoura\``);
    if (!acceptedReplies.includes(choice)) return message.reply(`Apenas estas respostas são aceitas: \`${acceptedReplies.join(', ')}\``);

    if (result === choice) return message.reply('Ei, dessa vez deu empate');

    switch (choice) {
      case 'pedra': {
        if (result === 'papel') return message.reply('Eu ganhei :3');
        return message.reply('Yayyy você venceu!');
      }
      case 'papel': {
        if (result === 'tesoura') return message.reply('Eu ganhei :3');
        return message.reply('Yeeey você venceu!');
      }
      case 'tesoura': {
        if (result === 'pedra') return message.reply('Eu ganhei OwO');
        return message.reply('OwO você venceu! ^^');
      }
      default: {
        return message.reply(`Apenas estas respostas são aceitas: \`${acceptedReplies.join(', ')}\``);
      }
    }
  },

};
