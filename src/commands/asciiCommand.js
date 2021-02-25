const figlet = require('figlet');

module.exports = {
  name: 'ascii',
  aliases: ['ascii'],
  cooldown: 1,
  guildOnly: false,

  async run(client, message, args) {
    if (!args[0]) return message.channel.send('Por favor Digite algo');
    if (args[0].length > 32) return message.channel.send('Você não pode digitar mais de 32 caracteres');
    msg = args.join(' ');

    figlet.text(msg, (err, data) => {
      if (err) {
        message.channel.send('Algo deu errado ao executar este comando');
        message.channel.send(err);
      }
      if (data.length > 2000) return message.channel.send('Por favor digite algo com menos de 2000 caractéres!');

      message.channel.send(`\`\`\`${data}\`\`\``);
    });
  },

};
