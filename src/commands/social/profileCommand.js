const Discord = require('discord.js');
const Canvas = require('canvas');
const { backgroundFix } = require('../../json/backgroundFix.json');

module.exports = {
  name: 'profile',
  aliases: ['profile', 'perfil'],
  cooldown: 5,
  guildOnly: true,
  clientPerms: ['ATTACH_FILES', 'READ_MESSAGE_HISTORY'],

  async run(client, message) {
    const db = require('quick.db');
    const user = message.mentions.users.first() || message.author;
    let money = await db.fetch(`coins_${user.id}`);
    if (money === null) money = 0;
    let bal = await db.fetch(`bal_${user.id}`)
    if (bal === null) bal = 0;

    let aboutme = await db.fetch(`aboutme_${user.id}`);
    if (aboutme == null) {
      db.set(`aboutme_${user.id}`,"Foxy é minha amiga (você pode alterar isso usando f!aboutme)!");
      aboutme = "Foxy é minha amiga (você pode alterar isso usando f!aboutme)!";
    } 

    const userPartner = await db.fetch(`married_${user.id}`);

    let rep = await db.fetch(`rep_${user.id}`);
    if (rep == null) rep = 0;

    const profile = await db.fetch(`background_${user.id}`);
    if (profile == null) {
      await db.set(`background_${user.id}`, 'default_background.png');
      message.foxyReply('Parece que você não tem um perfil, Acabei de criar um para você! :3');
    }

    const canvas = Canvas.createCanvas(1436, 884);
    const ctx = canvas.getContext('2d');

    function TemporaryFix(){
      const bgFile = String(db.fetch(`background_${user.id}`));
      const background = backgroundFix.find((index) => index.old == bgFile);
      if(background){
        db.set(`background_${message.author.id}`, background.new);
        return background.new;
      } else {
        return bgFile;
      }
    }

    const background = await Canvas.loadImage(`./src/assets/backgrounds/${TemporaryFix()}`);

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);


    ctx.font = '70px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${user.username}`, canvas.width / 6.0, canvas.height / 9.5);

    ctx.font = '40px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Reps: ${rep} \nCarteira: ${money}`, canvas.width / 1.5, canvas.height / 7.0);

    if (userPartner !== null) {
      let user2 = await client.users.fetch(userPartner)
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

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `Foxy${Date.now()}.png`);
    message.foxyReply(attachment);
  },
};