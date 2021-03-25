const figlet = require('figlet');

module.exports = {
  name: 'ascii',
  aliases: ['ascii'],
  cooldown: 1,
  guildOnly: false,

  async run(client, message, args) {
    if (!args[0]) return message.reply('Por favor Digite algo');
    if (args[0].length > 32) return message.reply('Você não pode digitar mais de 32 caracteres');
    let msg = args.join(' ');

    figlet.text(msg, (err, data) => {
      if (err) {
        message.reply('Algo deu errado ao executar este comando');
        message.reply(err);
      }
      if (data.length > 2000) return message.reply('Por favor digite algo com menos de 2000 caractéres!');

      message.reply(`\`\`\`${data}\`\`\``);
    });
  },

};
