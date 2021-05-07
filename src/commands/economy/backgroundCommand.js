module.exports = {
  name: 'background',
  aliases: ['background', 'backgrounds', 'wallpaper', 'wallpapers'],
  cooldown: 5,
  guildOnly: false,

  async run(client, message, args) {
    const db = require('quick.db');
    const ms = require('parse-ms');

    const { MessageEmbed } = require('discord.js');

    const user = message.author;
    const timeout = 31200000;
    const background2 = await db.fetch(`background_${user.id}`);
    const money = await db.fetch(`coins_${user.id}`);

    switch (args[0]?.toLowerCase()) {
      case 'reset':
        if (background2 == null) return message.FoxyReply('Você não tem nenhum background para redefinir!');
        if (background2 == 'default_background.png') return message.FoxyReply('Você não tem nenhum background para redefinir!');

        const time = await db.fetch(`time_${user.id}`);
        if (time !== null && timeout - (Date.now() - time) > 0) {
          const times = ms(timeout - (Date.now() - time));
          message.FoxyReply(`Você não pode redefinir seu background! Tente novamente em **${times.hours}h ${times.minutes}m ${times.seconds}s**`);
        } else {
          db.add(`coins_${user.id}`, 9000);
          message.FoxyReply('Desculpe pela incoveniência, eu redefini seu background para o padrão! Você recebeu 9000 FoxCoins de compensação');
          db.set(`background_${user.id}`, 'default_background.png');
          db.set(`time_${user.id}`, Date.now());
        }

        break;

      case 'winxp':
        const winxp = new MessageEmbed()
          .setTitle('Windows XP')
          .setDescription("Deseja comprar este background?")
          .setImage('https://cdn.discordapp.com/attachments/816457751680385044/817895428338221106/foxy_profile.png')
        message.FoxyReply(winxp).then((sentMessage) => {
          sentMessage.react('✅');
          const filter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
          sentMessage.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] })
            .then((collected) => {
              if (money < 1000) return message.FoxyReply('Você não tem coins o suficiente para este background');
              message.FoxyReply(`Você comprou o background **Windows XP**, ele já foi definido`);

              db.subtract(`coins_${user.id}`, 3000);
              db.set(`background_${user.id}`, 'windows_xp.png');
            }).catch(collected => {
              message.FoxyReply("Tempo esgotado")
            })
        });

        break;

      case 'red':
        const reddead = new MessageEmbed()
          .setTitle('Red Dead Redemption 2')
          .setDescription("Deseja comprar este background?")
          .setImage('https://cdn.discordapp.com/attachments/816457751680385044/817895595594481674/foxy_profile.png')
        message.FoxyReply(reddead).then((sentMessage) => {
          sentMessage.react('✅');
          const filter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
          sentMessage.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] })
            .then((collected) => {
              if (money < 5000) return message.FoxyReply('Você não tem coins o suficiente para este background');
              message.FoxyReply(`Você comprou o background **Red Dead Redemption 2**, ele já foi definido`);
              db.subtract(`coins_${user.id}`, 5000);
              db.set(`background_${user.id}`, 'red_dead.png');
            }).catch(collected => {
              message.FoxyReply("Tempo esgotado")
            })
        });
        break;

      case 'gta':
        const gtasa = new MessageEmbed()
          .setTitle('Grand Theft Auto: San Andreas')
          .setDescription("Deseja comprar este background?")
          .setImage('https://cdn.discordapp.com/attachments/816457751680385044/817895541013872700/foxy_profile.png')
        message.FoxyReply(gtasa).then((sentMessage) => {
          sentMessage.react('✅');
          const filter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
          sentMessage.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] })
            .then((collected) => {
              if (money < 9000) return message.FoxyReply('Você não tem coins o suficiente para este background');
              message.FoxyReply(`Você comprou o background **Grand Theft Auto: San Andreas**, ele já foi definido`);
              db.subtract(`coins_${user.id}`, 9000);
              db.set(`background_${user.id}`, 'gta_san.png');
            }).catch(collected => {
              message.FoxyReply("Tempo esgotado")
            })
        });
        break;

      case 'fnaf':
        const fnaf = new MessageEmbed()
          .setTitle('Five Night\'s at Freddy\'s')
          .setDescription("Deseja comprar este background?")
          .setImage('https://cdn.discordapp.com/attachments/816457751680385044/817895665274191923/foxy_profile.png')
        message.FoxyReply(fnaf).then((sentMessage) => {
          sentMessage.react('✅');
          const filter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
          sentMessage.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] })
            .then((collected) => {
              if (money < 9000) return message.FoxyReply('Você não tem coins o suficiente para este background');
              message.FoxyReply(`Você comprou o background **Five Night's at Freddy's**, ele já foi definido`);
              db.subtract(`coins_${user.id}`, 9000);
              db.set(`background_${user.id}`, 'fnaf_background.png');
            }).catch(collected => {
              message.FoxyReply("Tempo esgotado")
            })
        });

        break;

      case 'foxy':
        const vlog = new MessageEmbed()
          .setTitle('Foxy Vlogger')
          .setDescription("Deseja comprar este background?")
          .setImage('https://cdn.discordapp.com/attachments/816457751680385044/817895700196229190/foxy_profile.png')
        message.FoxyReply(vlog).then((sentMessage) => {
          sentMessage.react('✅');
          const filter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
          sentMessage.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] })
            .then((collected) => {
              if (money < 5000) return message.FoxyReply('Você não tem coins o suficiente para este background');
              message.FoxyReply(`Você comprou o background **Foxy Vlogger**, ele já foi definido`);
              db.subtract(`coins_${user.id}`, 5000);
              db.set(`background_${user.id}`, 'foxy_vlogs.png');
            }).catch(collected => {
              message.FoxyReply("Tempo esgotado, você demorou para reagir!")
            })
        });
        break;

      case 'lori':

        const lori = new MessageEmbed()
          .setTitle('<a:loriyay:810599942888489030> Loritta e Foxy')
          .setDescription("Deseja comprar este background? \n\n Loritta foi criada por **MrPowerGamerBR#4185** Você pode adicionar a Loritta clicando [aqui](https://loritta.website)")
          .setImage('https://cdn.discordapp.com/attachments/816457751680385044/817895343193718784/foxy_profile.png')
        message.FoxyReply(lori).then((sentMessage) => {
          sentMessage.react('✅');
          const filter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
          sentMessage.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] })
            .then((collected) => {
              if (money < 10000) return message.FoxyReply('Você não tem coins o suficiente para este background');
              message.FoxyReply(`Você comprou o background **Foxy e Loritta**, ele já foi definido`);
              db.subtract(`coins_${user.id}`, 10000);
              db.set(`background_${user.id}`, 'foxy_e_lori.png');
            }).catch(collected => {
              message.FoxyReply("Tempo esgotado")
            })
        });
        break;

      case 'sad_cat_money':
        const money2 = new MessageEmbed()
          .setTitle('Sad Cat Money')
          .setDescription('Deseja comprar este background?')
          .setImage('https://cdn.discordapp.com/attachments/817835933914103828/820427411739901982/foxy_profile.png')
        message.FoxyReply(money2).then((sentMessage) => {
          sentMessage.react('✅');
          const filter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
          sentMessage.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] })
            .then((collected) => {
              if (money < 10000) return message.FoxyReply('Você não tem coins o suficiente para este background');
              message.FoxyReply('Você comprou o background **Sad Cat Money**, ele já foi definido');
              db.subtract(`coins_${user.id}`, 10000);
              db.set(`background_${user.id}`, 'sad_cat_money.png')
            }).catch(collected => {
              message.FoxyReply("Tempo esgotado, você demorou para reagir")
            })
        })
        break;

      case 'levi':
        const money3 = new MessageEmbed()
          .setTitle('Levi / Ata Shingeki No Kyojin')
          .setDescription('Deseja comprar este background?')
          .setImage('https://cdn.discordapp.com/attachments/810597092993007649/823604139451482172/foxy_profile.png')
        message.FoxyReply(money3).then((sentMessage) => {
          sentMessage.react('✅');
          const filter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
          sentMessage.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] })
            .then((collected) => {
              if (money < 10000) return message.FoxyReply('Você não tem coins o suficiente para este background')
              message.FoxyReply('Você comprou o background **Ata Shingeki No Kyojin**, ele já foi definido')
              db.subtract(`coins_${user.id}`, 10000)
              db.set(`background_${user.id}`, 'levi_kyojin.png')
            }).catch(collected => {
              message.FoxyReply("Tempo esgotado, você demorou para reagir!")
            })
        })
        break;

      default:
        const noargs = new MessageEmbed()

          .setColor('RED')
          .setTitle('Lojinha de Background :D')
          .setDescription('(Raro) **Foxy Vlogger** - 5000 FoxCoins - **Código:** foxy \n (Raro) **FNaF** - 9000 FoxCoins - **Código:** fnaf \n(Raro) **Red Dead** - 7000 FoxCoins - **Código:** red \n(Lendário) **GTA San Andreas** - 9000 FoxCoins - **Código:** gta \n(Lendário) **Windows XP** - 5000 FoxCoins - **Código:** winxp \n(Lendário) **Foxy e Lori** - 10000 FoxCoins - **Código:** lori \n(Lendário) **Sad Cat Money** - 10000 FoxCoins - **Código:** sad_cat_money \n(Lendário) **Ata Shingeki No Kyojin** - 10000 FoxCoins - **Código:** levi \n\n Use f!background reset para redefinir')
          .setFooter('Exemplo: f!background lori');
        message.FoxyReply(noargs);
    }
  },
};
