const figlet = require('figlet');

module.exports = {
  name: 'ascii',
  aliases: ['ascii'],
  cooldown: 1,
  guildOnly: false,
  clientPerms: ['READ_MESSAGE_HISTORY'],

  async run(client, message, args) {
    if (!args[0]) return message.foxyReply('Por favor Digite algo');
    if (args[0].length > 32) return message.foxyReply('Você não pode digitar mais de 32 caracteres');
    let msg = args.join(' ');

    figlet.text(msg, (err, data) => {
      if (err) {
        message.foxyReply('Algo deu errado ao executar este comando');
        message.foxyReply(err);
      }
      if (data.length > 2000) return message.foxyReply('Por favor digite algo com menos de 2000 caractéres!');

      message.foxyReply(`\`\`\`${data}\`\`\``);
    });
  },

};
