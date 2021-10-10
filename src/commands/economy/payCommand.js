const { MessageEmbed } = require('discord.js')
const user = require('../../structures/databaseConnection');

module.exports = {
  name: 'pay',
  aliases: ['pay', 'pagar'],
  cooldown: 5,
  guildOnly: true,

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

    if(!userMention) return message.foxyReply(payEmbed);
    const mentionData = await user.findOne({ user: userMention.id });

    if (!mentionData) return message.foxyReply(`${client.emotes.error} **|** Este usuário não está no meu banco de dados, bobinho`)

    if (user == message.author.id) return message.foxyReply('Você não pode transferir coins para si mesmo');
    if (!user) {
      return message.foxyReply(payEmbed);
    }

    if (isNaN(args[1])) return message.foxyReply('Digite números válidos!');

    if (!args[1]) {
      return message.foxyReply('Especifique uma quantidade para ser transferida');
    }

    if (message.content.includes('-')) {
      return message.foxyReply('Você não pode transferir coins negativas');
    }

    if (args[1] > userData.coins) {
      return message.foxyReply('Você não tem FoxCoins suficientes para transferir');
    }

    message.foxyReply(`💸 **|** Você deseja mesmo transferir ${args[1]} FoxCoins para ${userMention.user}? \nA Equipe da Foxy **Não se responsabiliza** pelas FoxCoins perdidas, então certifique-se de estar transferindo para uma pessoa de confiança! \nÉ proibido o comércio de conteúdo NSFW(+18) em troca de FoxCoins!`).then((sentMessage) => {
      sentMessage.react('✅');
      const filter = (reaction, usuario) => reaction.emoji.name === '✅' && usuario.id === message.author.id;
      const Collector = sentMessage.createReactionCollector(filter, { max: 1, time: 60000 });

      sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })

      Collector.on('collect', () => {
        message.foxyReply(`Você fez uma transação de ${args[1]} FoxCoins para ${userMention.user}`);
        mentionData.coins += args[1];
        userData.coins -= args[1];
        userData.save().catch(err => console.log(err));
        mentionData.save().catch(err => console.log(err));
      })
    });
  },
};
