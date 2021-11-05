const { bglist } = require('../../json/backgroundList.json');
const { MessageEmbed } = require('discord.js');
const fs = require("fs");

module.exports = {
  name: 'background',
  aliases: ['background', 'backgrounds', 'wallpaper', 'wallpapers'],
  cooldown: 5,
  guildOnly: false,
  clientPerms: ['ATTACH_FILES', 'EMBED_LINKS'],
  async run(client, message, args) {
    const userData = await client.db.getDocument(message.author.id);

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
      message.reply(bgHelp);
      return null;
    }

    if (!args[0]) {
      return sendHelp();
    }

    const background = await bglist.find((index) => index.id == args[0]?.toLowerCase());

    if (!background) {
      return sendHelp();
    }
    
    const bg = await userData.backgrounds;
    if(bg.includes(background.filename)) return message.reply("Você já tem esse background!");
    
    if (background.onlydevs && !client.config.owners.includes(message.author.id)) {
      message.reply("Desculpe, mas esse background só pode ser comprado por desenvolvedores.");
      return;
    }

    const bgInfo = new MessageEmbed()
      .setTitle(background.name)
      .setDescription(background.description)
      .addField("💵 Preço", `${background.foxcoins} FoxCoins`, true)
      .setFooter(`Raridade: ${background.rarity}`);

    const bExampleExists = await fs.existsSync(`./src/assets/backgrounds/examples/${background.filename}`);

    if (bExampleExists) {
      bgInfo.attachFiles(`./src/assets/backgrounds/examples/${background.filename}`).setImage(`attachment://${background.filename}`);
    } else {
      bgInfo.attachFiles(`./src/assets/backgrounds/${background.filename}`).setImage(`attachment://${background.filename}`);
    }

    message.reply(bgInfo).then((msg) => {
      msg.react("✅");
      setTimeout(() => msg.react("❌"), 1000);
      const filter = (reaction, user) => user.id === message.author.id;
      msg.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] }).then((reactionData) => {
        if (reactionData.first().emoji.name === "✅") {
          if (userData.balance < background.foxcoins) {
            return msg.foxyReply("Você não tem coins o suficiente para este background!");
          } else {
            userData.balance -= background.foxcoins;
            userData.background = background.filename;
            userData.backgrounds.push(background.filename);
            userData.save().catch(err => console.log(err));
            msg.foxyReply(`Você comprou o background **${background.name}**, ele já foi definido`);
          }
        } else if (reactionData.first().emoji.name === "❌") {
          msg.delete();
          msg.channel.send("Operação cancelada");
        }
      });
    });

    return null;
  },
};