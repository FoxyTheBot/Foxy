const backgrounds = require('../../structures/backgroundList.json');

module.exports = {
  name: 'background',
  aliases: ['background', 'backgrounds', 'wallpaper', 'wallpapers'],
  cooldown: 5,
  guildOnly: false,
  clientPerms: ['ATTACH_FILES', 'EMBED_LINKS'],

  async run(client, message, args) {
    const db = require('quick.db');

    const { MessageEmbed } = require('discord.js');

    const user = message.author;
    const timeout = 31200000;
    const background2 = await db.fetch(`background_${user.id}`);
    const money = await db.fetch(`coins_${user.id}`);

    switch (args[0]?.toLowerCase()) {

      case 'reset':
        if (background2 == null) return message.foxyReply('Você não tem nenhum background para redefinir!');
        if (background2 == 'default_background.png') return message.foxyReply('Você não tem nenhum background para redefinir!');

        const time = await db.fetch(`time_${user.id}`);
        if (time !== null && timeout - (Date.now() - time) > 0) {
          const times = ms(timeout - (Date.now() - time));
          message.foxyReply(`Você não pode redefinir seu background! Tente novamente em **${times.hours}h ${times.minutes}m ${times.seconds}s**`);
        } else {
          db.add(`coins_${user.id}`, 9000);
          message.foxyReply('Desculpe pela incoveniência, eu redefini seu background para o padrão! Você recebeu 9000 FoxCoins de compensação');
          db.set(`background_${user.id}`, 'default_background.png');
          db.set(`time_${user.id}`, Date.now());
        }
        break;

      case 'winxp':
        const winxp = new MessageEmbed()
          .setTitle(backgrounds.windowsxp.name)
          .setDescription(backgrounds.windowsxp.description)
          .addField("💵 Preço", backgrounds.windowsxp.foxcoins + " FoxCoins", true)
          .setImage('https://cdn.discordapp.com/attachments/816457751680385044/817895428338221106/foxy_profile.png')
          .setFooter("Raridade: " + backgrounds.windowsxp.rarity)

        message.foxyReply(winxp).then((sentMessage) => {
          sentMessage.react('✅');
          const filter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
          sentMessage.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] })
            .then((collected) => {
              if (money < 1000) return message.foxyReply('Você não tem coins o suficiente para este background');
              message.foxyReply(`Você comprou o background **Windows XP**, ele já foi definido`);

              db.subtract(`coins_${user.id}`, 3000);
              db.push(`background_${user.id}.backgrounds`, backgrounds.windowsxp.filename);
              db.set(`background_${user.id}.default`, backgrounds.windowsxp.filename)
            }).catch(collected => {
              return;
            })
        });

        break;

      case 'red':
        const reddead = new MessageEmbed()
          .setTitle(backgrounds.reddead.name)
          .setDescription(backgrounds.reddead.description)
          .addField("💵 Preço", backgrounds.reddead.foxcoins + " FoxCoins", true)
          .setImage('https://cdn.discordapp.com/attachments/816457751680385044/817895595594481674/foxy_profile.png')
          .setFooter("Raridade: " + backgrounds.reddead.rarity)

        message.foxyReply(reddead).then((sentMessage) => {
          sentMessage.react('✅');
          const filter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
          sentMessage.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] })
            .then((collected) => {
              if (money < 5000) return message.foxyReply('Você não tem coins o suficiente para este background');
              message.foxyReply(`Você comprou o background **Red Dead Redemption 2**, ele já foi definido`);
              db.subtract(`coins_${user.id}`, 5000);
              db.push(`background_${user.id}.backgrounds`, backgrounds.reddead.filename);
              db.set(`background_${user.id}.default`, backgrounds.reddead.filename)
            }).catch(collected => {
              return;
            })
        });
        break;

      case 'gta':
        const gtasa = new MessageEmbed()
          .setTitle(backgrounds.gtasa.name)
          .setDescription(backgrounds.gtasa.description)
          .addField("💵 Preço", backgrounds.gtasa.foxcoins + " FoxCoins", true)
          .setImage('https://cdn.discordapp.com/attachments/816457751680385044/817895541013872700/foxy_profile.png')
          .setFooter("Raridade: " + backgrounds.gtasa.rarity)

        message.foxyReply(gtasa).then((sentMessage) => {
          sentMessage.react('✅');
          const filter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
          sentMessage.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] })
            .then((collected) => {
              if (money < 9000) return message.foxyReply('Você não tem coins o suficiente para este background');
              message.foxyReply(`Você comprou o background **Grand Theft Auto: San Andreas**, ele já foi definido`);
              db.subtract(`coins_${user.id}`, 9000);
              db.push(`background_${user.id}.backgrounds`, backgrounds.gtasa.filename);
              db.set(`background_${user.id}.default`, backgrounds.gtasa.filename)
            }).catch(collected => {
              return;
            })
        });
        break;

      case 'fnaf':
        const fnaf = new MessageEmbed()
          .setTitle(backgrounds.fnaf.name)
          .setDescription(backgrounds.fnaf.description)
          .addField("💵 Preço", backgrounds.fnaf.foxcoins + " FoxCoins", true)
          .setImage('https://cdn.discordapp.com/attachments/816457751680385044/817895665274191923/foxy_profile.png')
          .setFooter("Raridade: " + backgrounds.fnaf.rarity)

        message.foxyReply(fnaf).then((sentMessage) => {
          sentMessage.react('✅');
          const filter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
          sentMessage.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] })
            .then((collected) => {
              if (money < 9000) return message.foxyReply('Você não tem coins o suficiente para este background');
              message.foxyReply(`Você comprou o background **Five Night's at Freddy's**, ele já foi definido`);
              db.subtract(`coins_${user.id}`, 9000);
              db.push(`background_${user.id}.backgrounds`, backgrounds.fnaf.filename);
              db.set(`background_${user.id}.default`, backgrounds.fnaf.filename)
            }).catch(collected => {
              return;
            })
        });

        break;

      case 'foxy':
        const vlog = new MessageEmbed()
          .setTitle(backgrounds.foxytube.name)
          .setDescription(backgrounds.foxytube.description)
          .addField(" 💵 Preço", backgrounds.foxytube.foxcoins + " FoxCoins", true)
          .setImage('https://cdn.discordapp.com/attachments/816457751680385044/817895700196229190/foxy_profile.png')
          .setFooter("Raridade: " + backgrounds.foxytube.rarity)

        message.foxyReply(vlog).then((sentMessage) => {
          sentMessage.react('✅');
          const filter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
          sentMessage.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] })
            .then((collected) => {
              if (money < 5000) return message.foxyReply('Você não tem coins o suficiente para este background');
              message.foxyReply(`Você comprou o background **Foxy Vlogger**, ele já foi definido`);
              db.subtract(`coins_${user.id}`, 5000);
              db.push(`background_${user.id}.backgrounds`, backgrounds.foxytube.filename);
              db.set(`background_${user.id}.default`, backgrounds.foxytube.filename)
            }).catch(collected => {
              return;
            })
        });
        break;

      case 'lori':

        const lori = new MessageEmbed()
          .setTitle(backgrounds.foxylori.name)
          .setDescription(backgrounds.foxylori.description)
          .addField(" 💵 Preço", backgrounds.foxylori.foxcoins + " FoxCoins", true)
          .setImage('https://cdn.discordapp.com/attachments/816457751680385044/817895343193718784/foxy_profile.png')
        message.foxyReply(lori).then((sentMessage) => {
          sentMessage.react('✅');
          const filter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
          sentMessage.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] })
            .then((collected) => {
              if (money < 10000) return message.foxyReply('Você não tem coins o suficiente para este background');
              message.foxyReply(`Você comprou o background **Foxy e Loritta**, ele já foi definido`);
              db.subtract(`coins_${user.id}`, 10000);
              db.push(`background_${user.id}.backgrounds`, backgrounds.foxylori.filename);
              db.set(`background_${user.id}.default`, backgrounds.foxylori.filename)
            }).catch(collected => {
              return;
            })
        });
        break;

      case 'sad_cat_money':
        const money2 = new MessageEmbed()
          .setTitle(backgrounds.sadcatmoney.name)
          .setDescription(backgrounds.sadcatmoney.description)
          .addField(" 💵 Preço", backgrounds.sadcatmoney.foxcoins + " FoxCoins", true)
          .setImage('https://cdn.discordapp.com/attachments/817835933914103828/820427411739901982/foxy_profile.png')
        message.foxyReply(money2).then((sentMessage) => {
          sentMessage.react('✅');
          const filter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
          sentMessage.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] })
            .then((collected) => {
              if (money < 10000) return message.foxyReply('Você não tem coins o suficiente para este background');
              message.foxyReply('Você comprou o background **Sad Cat Money**, ele já foi definido');
              db.subtract(`coins_${user.id}`, 10000);
              db.push(`background_${user.id}.backgrounds`, backgrounds.sadcatmoney.filename)
              db.set(`background_${user.id}.default`, backgrounds.sadcatmoney.filename)
            }).catch(collected => {
              return;
            })
        })
        break;

      case 'levi':
        const money3 = new MessageEmbed()
          .setTitle(backgrounds.levi.name)
          .setDescription(backgrounds.levi.description)
          .addField(" 💵 Preço", backgrounds.levi.foxcoins + " FoxCoins", true)
          .setImage('https://cdn.discordapp.com/attachments/810597092993007649/823604139451482172/foxy_profile.png')
        message.foxyReply(money3).then((sentMessage) => {
          sentMessage.react('✅');
          const filter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
          sentMessage.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] })
            .then((collected) => {
              if (money < 10000) return message.foxyReply('Você não tem coins o suficiente para este background')
              message.foxyReply('Você comprou o background **Ata Shingeki No Kyojin**, ele já foi definido')
              db.subtract(`coins_${user.id}`, 10000)
              db.push(`background_${user.id}.backgrounds`, backgrounds.levi.filename)
              db.set(`background_${user.id}.default`, backgrounds.levi.filename)
            }).catch(collected => {
              return;
            })
        })
        break;

      default:
        const noargs = new MessageEmbed()

          .setColor('RED')
          .setTitle('Lojinha de Background :D')
          .setDescription(
            `(${backgrounds.fnaf.rarity}) **${backgrounds.fnaf.name}** - ${backgrounds.fnaf.foxcoins} FoxCoins - **Código:** fnaf \n` +
            `(${backgrounds.foxytube.rarity}) **${backgrounds.foxytube.name}** - ${backgrounds.foxytube.foxcoins} FoxCoins - **Código:** foxy \n` +
            `(${backgrounds.gtasa.rarity}) **${backgrounds.gtasa.name}** - ${backgrounds.gtasa.foxcoins} FoxCoins - **Código:** gta \n` +
            `(${backgrounds.reddead.rarity}) **${backgrounds.reddead.name}** - ${backgrounds.reddead.foxcoins} FoxCoins - **Código:** red \n` +
            `(${backgrounds.windowsxp.rarity}) **${backgrounds.windowsxp.name}** - ${backgrounds.windowsxp.foxcoins} FoxCoins - **Código:** winxp \n` +
            `(${backgrounds.foxylori.rarity}) **${backgrounds.foxylori.name}** - ${backgrounds.foxylori.foxcoins} FoxCoins - **Código:** lori \n` +
            `(${backgrounds.sadcatmoney.rarity}) **${backgrounds.sadcatmoney.name}** - ${backgrounds.foxylori.foxcoins} FoxCoins - **Código:** sad_cat_money \n` +
            `(${backgrounds.levi.rarity}) **${backgrounds.levi.name}** - ${backgrounds.levi.foxcoins} FoxCoins - **Código:** levi` +
            `\n\n Use f!background reset para redefinir`)
          .setFooter('Exemplo: f!background lori');
        message.foxyReply(noargs);
    }
  },
};