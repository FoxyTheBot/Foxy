module.exports = {
  name: 'tf',
  aliases: ['tf'],
  cooldown: 3,
  guildOnly: false,

  async run(client, message, args) {

    if (!args) {
      message.FoxyReply('Digite uma pergunta');
    } else {
      const results = ['Verdade', 'Falso'];
      const result = Math.floor((Math.random() * results.length));
      {
      }

      message.FoxyReply(results[result]);
    }
  },
};
