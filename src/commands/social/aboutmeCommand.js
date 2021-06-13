const { MessageEmbed } = require('discord.js')
const db = require('quick.db');
module.exports = {
  name: 'aboutme',
  aliases: ['aboutme', 'sobremim'],
  cooldown: 5,
  guildOnly: false,
  clientPerms: ['READ_MESSAGE_HISTORY'],

  async run(client, message, args) {
    const aboutme = args.join(' ');

    if (aboutme.length > 62) return message.foxyReply('Você digitou mais de 62 caracteres, O limite de caracteres é 62, bobinho')
    const aboutmeEmbed = new MessageEmbed()
      .setColor('RED')
      .setTitle('ℹ | `f!aboutme`')
      .setDescription('Altere sua mensagem de perfil do `f!profile` \n\n 📚 **Exemplos**')
      .addField("Alterar o Sobre Mim", "`f!aboutme Olá eu sou amigo da Foxy!`")
      .addField("ℹ Aliases:", "`sobremim`")
      .setFooter(`• Autor: ${message.author.tag} - Social`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }));
    
      if (!aboutme) return message.foxyReply(aboutmeEmbed);

    const user = message.author;
    db.set(`aboutme_${user.id}`, aboutme);
    if (message.content.includes('@')) return message.foxyReply("Você não pode mencionar ninguém!")

    message.foxyReply(`Alterei sua mensagem de perfil para \`${aboutme}\``);
  },
};
