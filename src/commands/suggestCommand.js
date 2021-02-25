const { MessageEmbed } = require('discord.js');
const colors = require('../structures/color.json');
const emotes = require('../structures/emotes.json');

module.exports = {
  name: 'suggest',
  aliases: ['sugerir', 'sugestão'],
  cooldown: 10,
  guildOnly: true,

  async run(client, message, args) {
    const suggestion = args.join(' ');
    const embed = new MessageEmbed()
      .setColor(colors.default)
      .setTitle('Dê uma sugestão para a Foxy')
      .setDescription('Este comando é utilizado para deixar uma sugestão para a Foxy! Para usar use `f!sugerir <sugestão>`')
      .setFooter('Não use este comando para brincadeiras, você poderá ser banido de usar a Foxy se fazer isto!');

    if (!suggestion) return message.channel.send(embed);

    message.channel.send(`Obrigada por me ajudar ${message.author}, sua sugestão foi enviada com sucesso! <:meow_blush:768292358458179595>`);
    const pfp = message.author.avatarURL();
    const suggest = new MessageEmbed()
      .setColor(colors.rp)
      .setTitle('Nova sugestão para a Foxy!')
      .setThumbnail(pfp)
      .setDescription(`${emotes.heart} **Usuário:** ${message.author.username} / ${message.author.id} \n\n ${emotes.success} **Sugestão:** ${suggestion} \n\n ${emotes.thumbsup} **Servidor:** ${message.guild.name} / ${message.guild.id}`);
    client.suggestWebhook.send(suggest);
  },

};
