module.exports = {
  name: 'tf',
  aliases: ['tf'],
  cooldown: 3,
  guildOnly: false,
  argsRequire: true,
  async run(client, message, args) {
    if (!args) {
      message.channel.send('Digite uma pergunta');
    } else {
      const results = ['Verdade', 'Falso'];
      const result = Math.floor((Math.random() * results.length));
      {
      }

      message.channel.send(results[result]);
    }
  },
};
