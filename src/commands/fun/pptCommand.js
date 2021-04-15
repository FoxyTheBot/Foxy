
module.exports = {
  name: 'ppt',
  aliases: ['ppt'],
  cooldown: 3,
  guildOnly: false,
  async run(client, message, args) {
    const acceptedReplies = ['pedra', 'papel', 'tesoura'];
    const random = Math.floor((Math.random() * acceptedReplies.length));
    const result = acceptedReplies[random];

    const choice = args[0];
    if (!choice) return message.inlineReply(`Como jogar \`${client.config.prefix}ppt <pedra|papel|tesoura\``);
    if (!acceptedReplies.includes(choice)) return message.inlineReply(`Apenas estas respostas são aceitas: \`${acceptedReplies.join(', ')}\``);

    if (result === choice) return message.inlineReply('Ei, dessa vez deu empate');

    switch (choice) {
      case 'pedra': {
        if (result === 'papel') return message.inlineReply('Eu ganhei :3');
        return message.inlineReply('Yayyy você venceu!');
      }
      case 'papel': {
        if (result === 'tesoura') return message.inlineReply('Eu ganhei :3');
        return message.inlineReply('Yeeey você venceu!');
      }
      case 'tesoura': {
        if (result === 'pedra') return message.inlineReply('Eu ganhei OwO');
        return message.inlineReply('OwO você venceu! ^^');
      }
      default: {
        return message.inlineReply(`Apenas estas respostas são aceitas: \`${acceptedReplies.join(', ')}\``);
      }
    }
  },

};
