const { MessageEmbed } = require('discord.js')

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
      .setDescription("Você deve estar devendo alguma coisa, ou querendo ajudar um amigo, de FoxCoins a ele :D\n\n 📚 **Exemplos**")
      .addFields(
        { name: "🔹 Pagar pessoa via menção", value: "`f!pay WinG4merBR#7661 500`" },
        { name: "🔹 Pagar 1000 FoxCoins", value: "`f!pay WinG4merBR#7661 1000`" },
        { name: "ℹ Aliases:", value: "`pagar`" }
      )
      .setFooter(`• Autor: ${message.author.tag} - Economia`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }));

    const userMention = message.mentions.members.first();

    if(!userMention) return message.reply(payEmbed);
    const mentionData = await client.db.getDocument(userMention.id);

    if (!mentionData) return message.reply(`${client.emotes.error} **|** Este usuário não está no meu banco de dados, bobinho`)

    if (user == message.author.id) return message.reply('Você não pode transferir coins para si mesmo');
    if (!user) {
      return message.reply(payEmbed);
    }

    if (isNaN(args[1])) return message.reply('Digite números válidos!');

    if (!args[1]) {
      return message.reply('Especifique uma quantidade para ser transferida');
    }

    if (message.content.includes('-')) {
      return message.reply('Você não pode transferir coins negativas');
    }

    if (args[1] > userData.balance) {
      return message.reply('Você não tem FoxCoins suficientes para transferir');
    }

    message.reply(`💸 **|** Você deseja mesmo transferir ${args[1]} FoxCoins para ${userMention.user}? \nA Equipe da Foxy **Não se responsabiliza** pelas FoxCoins perdidas, então certifique-se de estar transferindo para uma pessoa de confiança! \nÉ proibido o comércio de conteúdo NSFW(+18) em troca de FoxCoins!`).then((sentMessage) => {
      sentMessage.react('✅');
      const filter = (reaction, usuario) => reaction.emoji.name === '✅' && usuario.id === message.author.id;
      const Collector = sentMessage.createReactionCollector(filter, { max: 1, time: 60000 });

      sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })

      Collector.on('collect', () => {
        message.reply(`Você fez uma transação de ${args[1]} FoxCoins para ${userMention.user}`);
        mentionData.balance += args[1];
        userData.balance -= args[1];
        userData.save().catch(err => console.log(err));
        mentionData.save().catch(err => console.log(err));
      })
    });
  },
};
