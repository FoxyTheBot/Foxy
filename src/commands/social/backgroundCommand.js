module.exports = {
  name: 'background',
  aliases: ['background'],
  cooldown: 5,
  guildOnly: false,

  async run(client, message, args) {
    const db = require('quick.db');
    const ms = require('parse-ms');

    const { MessageEmbed } = require('discord.js');

    const user = message.author;
    const timeout = 3600000;
    const background2 = await db.fetch(`background_${user.id}`);
    const money = await db.fetch(`coins_${user.id}`);

    switch (args[0]) {
      case 'reset':
        if (background2 == null) return message.reply('Você não tem nenhum background para redefinir!');
        if (background2 == 'default_background.png') return message.reply('Você não tem nenhum background para redefinir!');

        const time = await db.fetch(`time_${user.id}`);
        if (time !== null && timeout - (Date.now() - time) > 0) {
          const times = ms(timeout - (Date.now() - time));
          message.reply(`Você não pode redefinir seu background! Tente novamente em **${times.hours}h ${times.minutes}m ${times.seconds}s**`);
        } else {
          db.add(`coins_${user.id}`, 9000);
          message.reply('Desculpe pela incoveniência, eu redefini seu background para o padrão! Você recebeu 9000 FoxCoins de compensação');
          db.set(`background_${user.id}`, 'default_background.png');
          db.set(`time_${user.id}`, Date.now());
        }

        break;

      case 'winxp':
        const winxp = new MessageEmbed()
        .setTitle('Windows XP')
        .setDescription("Deseja comprar este background?")
        .setImage('https://cdn.discordapp.com/attachments/816457751680385044/817895428338221106/foxy_profile.png')
        message.reply(winxp).then((sentMessage) => {
          sentMessage.react('✅');
          const filter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
          sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then((collected) => {
              if (money < 1000) return message.reply('Você não tem coins o suficiente para este background');
              message.reply(`Você comprou o background **Windows XP**, ele já foi definido`);
    
              db.subtract(`coins_${user.id}`, 3000);
              db.set(`background_${user.id}`, 'windows_xp.png');
            }).catch(collected => {
              message.reply("Tempo esgotado")
            })
        });

        break;

      case 'red':
       const reddead = new MessageEmbed()
       .setTitle('Red Dead Redemption 2')
       .setDescription("Deseja comprar este background?")
       .setImage('https://cdn.discordapp.com/attachments/816457751680385044/817895595594481674/foxy_profile.png')
       message.reply(reddead).then((sentMessage) => {
         sentMessage.react('✅');
         const filter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
         sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
           .then((collected) => {
             if (money < 5000) return message.reply('Você não tem coins o suficiente para este background');
             message.reply(`Você comprou o background **Red Dead Redemption 2**, ele já foi definido`);
             db.subtract(`coins_${user.id}`, 5000);
             db.set(`background_${user.id}`, 'red_dead.png');
           }).catch(collected => {
            message.reply("Tempo esgotado")
          })
       });
        break;

      case 'gta':
       const gtasa = new MessageEmbed()
       .setTitle('Grand Theft Auto: San Andreas')
       .setDescription("Deseja comprar este background?")
       .setImage('https://cdn.discordapp.com/attachments/816457751680385044/817895541013872700/foxy_profile.png')
       message.reply(gtasa).then((sentMessage) => {
         sentMessage.react('✅');
         const filter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
         sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
           .then((collected) => {
            if (money < 9000) return message.reply('Você não tem coins o suficiente para este background');
            message.reply(`Você comprou o background **Grand Theft Auto: San Andreas**, ele já foi definido`);
             db.subtract(`coins_${user.id}`, 9000);
             db.set(`background_${user.id}`, 'gta_san.png');
           }).catch(collected => {
            message.reply("Tempo esgotado")
          })
       });
        break;

      case 'fnaf':
       const fnaf = new MessageEmbed()
       .setTitle('Five Night\'s at Freddy\'s')
       .setDescription("Deseja comprar este background?")
       .setImage('https://cdn.discordapp.com/attachments/816457751680385044/817895665274191923/foxy_profile.png')
       message.reply(fnaf).then((sentMessage) => {
         sentMessage.react('✅');
         const filter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
         sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
           .then((collected) => {
            if (money < 9000) return message.reply('Você não tem coins o suficiente para este background');
            message.reply(`Você comprou o background **Five Night's at Freddy's**, ele já foi definido`);
             db.subtract(`coins_${user.id}`, 9000);
             db.set(`background_${user.id}`, 'fnaf_background.png');
           }).catch(collected => {
            message.reply("Tempo esgotado")
          })
       });

        break;

      case 'foxy':
        const vlog = new MessageEmbed()
        .setTitle('Foxy Vlogger')
        .setDescription("Deseja comprar este background?")
        .setImage('https://cdn.discordapp.com/attachments/816457751680385044/817895700196229190/foxy_profile.png')
        message.reply(vlog).then((sentMessage) => {
          sentMessage.react('✅');
          const filter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
          sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then((collected) => {
             if (money < 5000) return message.reply('Você não tem coins o suficiente para este background');
             message.reply(`Você comprou o background **Foxy Vlogger**, ele já foi definido`);
              db.subtract(`coins_${user.id}`, 5000);
              db.set(`background_${user.id}`, 'foxy_vlogs.png');
            }).catch(collected => {
              message.reply("Tempo esgotado")
            })
        });
        break;

      case 'lori':

        const lori = new MessageEmbed()
        .setTitle('<a:loriyay:810599942888489030> Loritta e Foxy')
        .setDescription("Deseja comprar este background? \n\n Loritta foi criada por **MrPowerGamerBR#4185** Você pode adicionar a Loritta clicando [aqui](https://loritta.website)")
        .setImage('https://cdn.discordapp.com/attachments/816457751680385044/817895343193718784/foxy_profile.png')
        message.reply(lori).then((sentMessage) => {
          sentMessage.react('✅');
          const filter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
          sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then((collected) => {
             if (money < 10000) return message.reply('Você não tem coins o suficiente para este background');
             message.reply(`Você comprou o background **Foxy e Loritta**, ele já foi definido`);
              db.subtract(`coins_${user.id}`, 10000);
              db.set(`background_${user.id}`, 'foxy_e_lori.png');
            }).catch(collected => {
              message.reply("Tempo esgotado")
            })
        });
        break;

      default:
        const noargs = new MessageEmbed()

          .setColor('RED')
          .setTitle('Lojinha de Background :D')
          .setDescription('(Raro) **Foxy Vlogger** - 5000 FoxCoins - **Código:** foxy \n (Raro) **FNaF** - 9000 FoxCoins - **Código:** fnaf \n(Raro) **Red Dead** - 7000 FoxCoins - **Código:** red \n(Lendário) **GTA San Andreas** - 9000 FoxCoins - **Código:** gta \n(Lendário) **Windows XP** - 5000 FoxCoins - **Código:** winxp \n(Lendário) **Foxy e Lori** - 10000 - **Código:** lori \n\n Use f!background reset para redefinir')
          .setFooter('Exemplo: f!background lori');
        message.reply(noargs);
    }
  },
};
