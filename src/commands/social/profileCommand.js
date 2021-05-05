const Discord = require('discord.js');
const Canvas = require('canvas');

module.exports = {
  name: 'profile',
  aliases: ['profile', 'perfil'],
  cooldown: 5,
  guildOnly: true,

  async run(client, message, args) {
    const db = require('quick.db');
    const user = message.mentions.users.first() || message.author;
    let money = await db.fetch(`coins_${user.id}`);
    if (money === null) money = 0;
    let bal = await db.fetch(`bal_${user.id}`)
    if (bal === null) bal = 0;

    let aboutme = await db.fetch(`aboutme_${user.id}`);
    if (aboutme == null) aboutme = `Foxy é minha amiga (você pode alterar isso usando f!aboutme)!`;

    const casado = await db.fetch(`married_${user.id}`);

    let rep = await db.fetch(`rep_${user.id}`);
    if (rep == null) rep = 0;

    const profile = db.fetch(`background_${user.id}`);
    if (profile == null) {
      db.set(`background_${user.id}`, 'default_background.png');
      message.FoxyReply('Parece que você não tem um perfil, seu perfil foi criado, digite o comando novamente.');
    } else {
      const applyText = (canvas, text) => {
        const ctx = canvas.getContext('2d');
        let fontSize = 70;

        do {
          ctx.font = `${fontSize -= 10}px sans-serif`;
        } while (ctx.measureText(text).width > canvas.width - 300);

        return ctx.font;
      };
      
      const canvas = Canvas.createCanvas(1436, 884);
      const ctx = canvas.getContext('2d');
      const background = await Canvas.loadImage(`./src/layout/${profile}`);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#74037b';
      ctx.strokeRect(0, 0, canvas.width, canvas.height);


      ctx.font = '70px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${user.username}`, canvas.width / 6.0, canvas.height / 9.5);

      ctx.font = '40px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`Reps: ${rep} \nCarteira: ${money}`, canvas.width / 1.5, canvas.height / 7.0);

      if (casado !== null) {
        let user2 = await client.users.fetch(casado)
        ctx.font = '30px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`💍 Casado com: ${user2.tag}`, canvas.width / 6.0, canvas.height / 5.5);
      }

      ctx.font = ('30px sans-serif');
      ctx.fillStyle = '#ffffff';
      ctx.fillText(aboutme, canvas.width / 55.0, canvas.height / 1.2);

      ctx.beginPath();
      ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();

      const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: 'png' }));
      ctx.drawImage(avatar, 25, 25, 200, 200);

      const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'foxy_profile.png');
      message.FoxyReply(attachment);
    }
  },
};
