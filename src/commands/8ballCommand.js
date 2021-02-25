const emotes = require('../structures/emotes.json')
module.exports = {
  name: '8ball',
  aliases: ['8ball', 'eightball', '8', 'ask'],
  cooldown: 5,
  guildOnly: false,
  argsRequire: true,
  async run(client, message, args) {
    let arg = args.join(" ")
    if(!arg) return message.channel.send(`${emotes.success} **|** ${message.author}, Digite algo para que eu possa responder`)
    const results = ['Sim', 'Não', 'Talvez', 'Com certeza!', 'Talvez', 'Provavelmente sim', 'Provavelmente não', 'Não entendi, pergunte novamente'];
    const result = Math.floor((Math.random() * results.length));
    message.channel.send(results[result]);
  },
};
