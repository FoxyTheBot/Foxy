const Discord = require('discord.js');

module.exports = {
  name: 'putin',
  aliases: ['putin', 'walk'],
  cooldown: 3,
  guildOnly: false,
  async run(client, message, args) {
    const sayMessage = args.join(' ');
    if (!sayMessage) return message.reply('Digite algo antes');
    const embed = new Discord.MessageEmbed()
      .setDescription(sayMessage)
      .setImage('https://media1.tenor.com/images/20af5cca901f8fe316c93174da43c4e8/tenor.gif')
      .setFooter(`Comando solicitado por ${message.author.tag}`);
    await message.reply(embed);
    
    client.hook.logsHook()

  },

};
