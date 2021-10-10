const { MessageEmbed } = require('discord.js')
const user = require('../../structures/databaseConnection');

module.exports = {
  name: 'aboutme',
  aliases: ['aboutme', 'sobremim'],
  cooldown: 5,
  guildOnly: false,
  clientPerms: ['READ_MESSAGE_HISTORY'],

  async run(client, message, args) {
    const userData = await user.findOne({ user: message.author.id });

    if (!userData) {
      message.foxyReply("Parece que você não está no meu banco de dados, execute o comando novamente!");
      return new user({
        user: message.author.id,
        coins: 0,
        lastDaily: null,
        reps: 0,
        lastRep: null,
        backgrounds: ['default.png'],
        background: 'default.png',
        aboutme: null,
        marry: null,
        premium: false,
      }).save().catch(err => console.log(err));
    }

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
    if (message.content.includes('@')) return message.foxyReply("Você não pode mencionar ninguém!")


    userData.aboutme = aboutme;
    userData.save().catch(err => console.log(err));

    message.foxyReply(`Alterei sua mensagem de perfil para \`${aboutme}\``);
  },
};
