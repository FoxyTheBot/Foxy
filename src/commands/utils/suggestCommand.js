const { MessageEmbed } = require('discord.js');
module.exports = {
  name: 'suggest',
  aliases: ['sugerir', 'sugestão'],
  cooldown: 10,
  guildOnly: true,

  run(client, message, args) {
    const suggestion = args.join(' ');
    const embed = new MessageEmbed()
      .setColor(client.colors.default)
      .setTitle('Dê uma sugestão para a Foxy')
      .setDescription('Este comando é utilizado para deixar uma sugestão para a Foxy! Para usar use `f!sugerir <sugestão>`')
      .setFooter('Não use este comando para brincadeiras, você poderá ser banido de usar a Foxy se fazer isto!');

    if (!suggestion) return message.inlineReply(embed);

    message.inlineReply(`Obrigada por me ajudar ${message.author}, sua sugestão foi enviada com sucesso! <:meow_blush:768292358458179595>`);

    client.hook.suggestHook()
  },

};
