const { bglist } = require('../../json/backgroundList.json');
const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const fs = require("fs");

module.exports = {
  name: 'background',
  aliases: ['background', 'backgrounds', 'wallpaper', 'wallpapers'],
  cooldown: 5,
  guildOnly: false,
  clientPerms: ['ATTACH_FILES', 'EMBED_LINKS'],
  async run(client, message, args) {
    const timeout = 31200000;
    const userBackground = await db.fetch(`background_${message.author.id}`);
    const userBalance = await db.fetch(`coins_${message.author.id}`);

    function sendHelp() {
      const bgHelp = new MessageEmbed()
        .setColor(client.colors.default)
        .setTitle('Lojinha de Background :D')
        .setFooter('Exemplo: f!background lori');
      var bgDesc = "";
      for (const bgHandle of bglist) {
        if (bgHandle.onlydevs) continue;
        bgDesc = bgDesc + `(${bgHandle.rarity}) **${bgHandle.name}** - ${bgHandle.foxcoins} FoxCoins - **Código:** ${bgHandle.id} \n`;
      }
      bgHelp.setDescription(bgDesc);
      message.foxyReply(bgHelp);
      return null;
    }

    if (!args[0]) {
      return sendHelp();
    }

    if (args[0].toLowerCase() == "reset") {
      if (userBackground == null || userBackground == 'default.png') return message.foxyReply('Você não tem nenhum background para redefinir!');

      const time = await db.fetch(`time_${message.author.id}`);

      if (time !== null && timeout - (Date.now() - time) > 0) {
        const times = ms(timeout - (Date.now() - time));
        message.foxyReply(`Você não pode redefinir seu background! Tente novamente em **${times.hours}h ${times.minutes}m ${times.seconds}s**`);
      } else {
        db.add(`coins_${message.author.id}`, 9000);
        db.set(`background_${message.author.id}`, 'default_background.png');
        db.set(`time_${message.author.id}`, Date.now());
        message.foxyReply('Desculpe pela incoveniência, eu redefini seu background para o padrão! Você recebeu 9000 FoxCoins de compensação');
      }
      return null;
    }

    const hBackground = await bglist.find((index) => index.id == args[0]?.toLowerCase());

    if (!hBackground) {
      return sendHelp();
    }

    if (hBackground.onlydevs && !client.config.owners.includes(message.author.id)) {
      return sendHelp();
    }

    const bgInfo = new MessageEmbed()
      .setTitle(hBackground.name)
      .setDescription(hBackground.description)
      .addField("💵 Preço", `${hBackground.foxcoins} FoxCoins`, true)
      .setFooter(`Raridade: ${hBackground.rarity}`);

    const bExampleExists = await fs.existsSync(`./src/assets/backgrounds/examples/${hBackground.filename}`);

    if (bExampleExists) {
      bgInfo.attachFiles(`./src/assets/backgrounds/examples/${hBackground.filename}`).setImage(`attachment://${hBackground.filename}`);
    } else {
      bgInfo.attachFiles(`./src/assets/backgrounds/${hBackground.filename}`).setImage(`attachment://${hBackground.filename}`);
    }

    message.foxyReply(bgInfo).then((hMessage) => {
      hMessage.react("✅");
      setTimeout(() => hMessage.react("❌"), 1000);
      const filter = (reaction, user) => user.id === message.author.id;
      hMessage.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] }).then((reactionData) => {
        if (reactionData.first().emoji.name === "✅") {
          if (userBalance < hBackground.foxcoins) {
            return hMessage.foxyReply("Você não tem coins o suficiente para este background!");
          } else {
            db.subtract(`coins_${message.author.id}`, hBackground.foxcoins);
            db.set(`background_${message.author.id}`, hBackground.filename);
            hMessage.foxyReply(`Você comprou o background **${hBackground.name}**, ele já foi definido`);
          }
        } else if (reactionData.first().emoji.name === "❌") {
          hMessage.delete();
          hMessage.channel.send("Operação cancelada");
        }
      });
    });

    return null;
  },
};