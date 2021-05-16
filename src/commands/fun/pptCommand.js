
module.exports = {
  name: 'ppt',
  aliases: ['ppt'],
  cooldown: 3,
  guildOnly: false,
  clientPerms: ['SEND_MESSAGES'],

  async run(client, message, args) {
    const acceptedReplies = ['pedra', 'papel', 'tesoura'];
    const random = Math.floor((Math.random() * acceptedReplies.length));
    const result = acceptedReplies[random];

    const choice = args[0];
    if (!choice) return message.FoxyReply(`Como jogar \`${client.config.prefix}ppt <pedra|papel|tesoura\``);
    if (!acceptedReplies.includes(choice)) return message.FoxyReply(`Apenas estas respostas são aceitas: \`${acceptedReplies.join(', ')}\``);

    if (result === choice) return message.FoxyReply('Ei, dessa vez deu empate');

    switch (choice) {
      case 'pedra': {
        if (result === 'papel') return message.FoxyReply('Eu ganhei :3');
        return message.FoxyReply('Yayyy você venceu!');
      }
      case 'papel': {
        if (result === 'tesoura') return message.FoxyReply('Eu ganhei :3');
        return message.FoxyReply('Yeeey você venceu!');
      }
      case 'tesoura': {
        if (result === 'pedra') return message.FoxyReply('Eu ganhei OwO');
        return message.FoxyReply('OwO você venceu! ^^');
      }
      default: {
        return message.FoxyReply(`Apenas estas respostas são aceitas: \`${acceptedReplies.join(', ')}\``);
      }
    }
  },

};
