const Discord = require('discord.js');

module.exports = {
  name: 'ideia',
  aliases: ['ideia', 'idea'],
  cooldown: 3,
  guildOnly: false,
  async run(client, message, args) {
    const content = args.join(' ');

    if (!args[0]) {
      return message.reply(`${message.author.username}, escreva a sugestão após o comando`);
    } if (content.length > 1000) {
      return message.reply(`${message.author.username}, forneça uma sugestão de no máximo 1000 caracteres.`);
    }
    const canal = message.guild.channels.cache.find((ch) => ch.id === '699780010235527278');
    const msg = await message.reply(
      new Discord.MessageEmbed()
        .setColor('#FFFFF1')
        .addField('Autor:', message.author)
        .addField('Conteúdo', content)
        .setFooter(`ID do Autor: ${message.author.id}`)
        .setTimestamp(),
    );
    await message.reply(`${message.author} a mensagem foi enviada com sucesso!`);

    const emojis = ['✔️', '❎'];

    for (const i in emojis) {
      await msg.react(emojis[i]);
    }
  },

};
