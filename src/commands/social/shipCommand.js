const Canvas = require('canvas');
const Discord = require('discord.js');

module.exports = {
  name: 'ship',
  aliases: ['ship', 'shippar'],
  cooldown: 3,
  guildOnly: true,
  clientPerms: ['EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY'],

  async run(client, message) {
    const canvas = Canvas.createCanvas(400, 400);

    const mention = message.mentions.members.first();
    const mention2 = message.mentions.members.last();

    if (!mention || !mention2) return message.foxyReply('kek');
    if (mention === mention2) return message.foxyReply("Mencione duas pessoas diferentes");

    const love = Math.floor(Math.random() * 100);

    const endName1 = mention.user.username.length;
    const endName2 = mention2.user.username.length;

    const calc1 = endName1 - 4;
    const calc2 = endName2 - 4;

    const ctx = canvas.getContext('2d');

    const applyText = (canvas, text) => {
      let fontSize = 70;

      do {
        ctx.font = `${fontSize -= 10}px sans-serif`;
      } while (ctx.measureText(text).width > canvas.width - 300);

      return ctx.font;
    };


    ctx.font = '30px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${mention.user.username}`, canvas.width / 6.0, canvas.height / 9.5);

    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    let nomeship;

    if (love > 60) {
      nomeship = mention.user.username.slice(0, 3) + mention2.user.username.slice(0, 3);
    } else if (love >= 40) {
      nomeship = mention.user.username.slice(0, calc1) + mention2.user.username.slice(0, calc2);
    } else {
      nomeship = mention.user.username.slice(calc1, endName1) + mention2.user.username.slice(calc2, endName2);
    }


    const foto1 = await Canvas.loadImage(mention.user.displayAvatarURL({ format: 'png' }));
    const foto2 = await Canvas.loadImage(mention2.user.displayAvatarURL({ format: 'png' }));

    ctx.drawImage(foto1, 25, 25, 200, 200);
    ctx.drawImage(foto2, 45, 45, 200, 200);

    const loveat = new Discord.MessageAttachment(canvas.toBuffer(), 'foxy_ship.png');

    message.foxyReply(":sparkling_heart: Será que vai rolar ou não? :sparkling_heart:", loveat);
  },
};
