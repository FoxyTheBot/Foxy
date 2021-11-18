const { MessageEmbed } = require('discord.js')
const user = require('../../structures/databaseConnection');

module.exports = {
  name: 'pay',
  aliases: ['pay', 'pagar'],
  cooldown: 5,
  guildOnly: true,

  async run(client, message, args) {
    const userData = await client.db.getDocument(message.author.id);

    const payEmbed = new MessageEmbed()
      .setColor(client.colors.green)
      .setTitle('💸 | `f!pay`')
      .setDescription("Você deve estar devendo alguma coisa, ou querendo ajudar um amigo? Você pode dar FoxCoins a ele! \n\n 📚 **Exemplos**")
      .addFields(
        { name: "🔹 Pagar a pessoa via menção", value: "`f!pay <@menção> <quantidade>`" },
      )
      .setFooter(`• Autor: ${message.author.tag} - Economia`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }));    // const payEmbed = new MessageEmbed()

    const userMention = message.mentions.members.first();
    const foxCoins = args[1];
    const mentionData = await user.findOne({ _id: userMention.id });
    const value = Math.round(foxCoins);

    if (!userMention || user == message.author.id) return message.foxyReply(payEmbed);
    if (!mentionData) return message.foxyReply(`${client.emotes.error} **|** Este usuário não está no meu banco de dados, bobinho`);
    if (isNaN(Number(args[1])) || Number(args[1]) === Infinity) return message.foxyReply(payEmbed);
    if (!foxCoins || message.content.includes('-') || foxCoins > userData.coins) return message.foxyReply(":x: | Você não tem FoxCoins o suficiente para transferir!");

    message.foxyReply(`💸 **|** Você deseja mesmo transferir ${args[1]} FoxCoins para ${userMention.user}? \nA Equipe da Foxy **Não se responsabiliza** pelas FoxCoins perdidas, então certifique-se de estar transferindo para uma pessoa de confiança! \nÉ proibido o comércio de conteúdo NSFW(+18) em troca de FoxCoins!`).then(sentMessage => {
      sentMessage.react("✅");
      const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
      const collector = sentMessage.createReactionCollector(filter, { max: 1, time: 60000});

      sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time']});

      collector.on('collect', () => {
        message.foxyReply(`Você transferiu ${foxCoins} FoxCoins para ${userMention.user}`);
        mentionData.balance += value;
        userData.balance -= value;
        userData.save();
        mentionData.save();
      });
    });
  },
};