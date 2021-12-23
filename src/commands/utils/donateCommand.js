const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'donate',
  aliases: ['donate', 'doar'],
  cooldown: 3,
  guildOnly: false,
  clientPerms: ['EMBED_LINKS', 'READ_MESSAGE_HISTORY'],

  async run(client, message) {
    const donateEmbed = new MessageEmbed()
      .setColor(client.colors.blurple)
      .setTitle('(._.`) Sabia que a crise afeta todos nós?')
      .setDescription("Eu preciso de dinheiro para ficar online<a:bugcat_sleepy:776250262146515006> \nVocê pode doar para mim usando [PayPal](https://www.paypal.com/donate/?hosted_button_id=J7Y747Q38UEKN) 90% do dinheiro é para pagar a hospedagem e 10% é para os desenvolvedores (mas as taxas do PayPal), agora a Foxy suporta Pix <:pix:848593788959850496>!")
      .setFooter("Chave Pix: 7abb33af-cb49-4d39-aaac-bb9ff24b7b87")

    message.reply(donateEmbed)
  },
};
