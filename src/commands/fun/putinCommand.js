const Discord = require('discord.js');

module.exports = {
  name: 'putin',
  aliases: ['putin', 'walk'],
  cooldown: 3,
  guildOnly: false,
  clientPerms: ['ATTACH_FILES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY'],

  async run(client, message, args) {
  
    const sayMessage = args.join(' ');
    if (!sayMessage) return message.reply('Digite algo antes');
    const embed = new Discord.MessageEmbed()
      .setDescription(sayMessage)
      .setImage('https://media1.tenor.com/images/20af5cca901f8fe316c93174da43c4e8/tenor.gif')
      .setFooter(`Comando solicitado por ${message.author.tag}`);
    await message.reply(embed);
    
    const logs = new Discord.MessageEmbed()
    .setTitle('Logs de comandos')
    .setDescription(`**Comando:** putinCommand \n **Autor:** ${message.author.tag} / ${message.author.id} \n\n **Servidor** ${message.guild.name} / ${message.guild.id} \n\n **Mensagem:** ${message.content} \n\n Link: [Mensagem](${message.url})`);
  client.logsWebhook.send({
    username: 'Logs',
    avatarURL: 'https://cdn.discordapp.com/attachments/766414535396425739/789255465125150732/sad.jpeg',
    embeds: [logs],
  });

  },

};
