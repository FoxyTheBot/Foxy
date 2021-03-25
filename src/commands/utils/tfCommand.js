module.exports = {
  name: 'tf',
  aliases: ['tf'],
  cooldown: 3,
  guildOnly: false,
  argsRequire: true,
  async run(client, message, args) {
    if (!args) {
      message.reply('Digite uma pergunta');
    } else {
      const results = ['Verdade', 'Falso'];
      const result = Math.floor((Math.random() * results.length));
      {
      }

      message.reply(results[result]);
    }
  },
};
