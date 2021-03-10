module.exports = {
  name: 'aboutme',
  aliases: ['aboutme', 'sobremim'],
  cooldown: 5,
  guildOnly: false,

  async run(client, message, args) {
    const db = require('quick.db');
    const aboutme = args.join(' ');
    const user = message.author;
    db.set(`aboutme_${user.id}`, aboutme);
    if (!aboutme) return message.reply('Digite algo!');
    if(message.content.includes('@')) return message.reply("Você não pode mencionar ninguém!")
    message.reply(`Alterei sua mensagem de perfil para \`${aboutme}\``);
  },
};
