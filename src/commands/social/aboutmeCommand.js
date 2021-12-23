const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'aboutme',
  aliases: ['aboutme', 'sobremim'],
  cooldown: 5,
  guildOnly: false,
  clientPerms: ['READ_MESSAGE_HISTORY'],

  async run(client, message, args) {
    if(!args){
      const aboutmeEmbed = new MessageEmbed()
      .setColor('RED')
      .setTitle('ℹ | `f!aboutme`')
      .setDescription('Altere sua mensagem de perfil do `f!profile` \n\n 📚 **Exemplos**')
      .addField("Alterar o Sobre Mim", "`f!aboutme Olá eu sou amigo da Foxy!`")
      .addField("ℹ Aliases:", "`sobremim`")
      .setFooter(`• Autor: ${message.author.tag} - Social`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }));
      return message.reply(aboutmeEmbed);
    }

    const userData = await client.db.getDocument(message.author.id);

    const aboutme = args.join(' ');

    if (aboutme.length > 60) return message.reply('Você digitou mais de 60 caracteres, O limite de caracteres é 60, bobinho')

    if (message.content.includes('@')) return message.reply("Você não pode mencionar ninguém!")    // This line of code should be replaced with a better solution

    userData.aboutme = aboutme;
    userData.save().catch(err => console.log(err));

    message.reply(`Alterei sua mensagem de perfil para \`${aboutme}\``);
  },
};
