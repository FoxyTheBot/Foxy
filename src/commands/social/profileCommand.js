const Discord = require('discord.js');
const Canvas = require('canvas');
const user = require('../../structures/databaseConnection');

module.exports = {
  name: 'profile',
  aliases: ['profile', 'perfil'],
  cooldown: 5,
  guildOnly: true,
  clientPerms: ['ATTACH_FILES', 'READ_MESSAGE_HISTORY'],

  async run(client, message) {
    const userMention = message.mentions.users.first() || message.author;
    const userData = await user.findOne({ user: userMention.id });

    if (!userData) {
      message.foxyReply("Parece que você não está no meu banco de dados, execute o comando novamente!");
      return new user({
        user: userMention.id,
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
    const userMoney = await userData.coins;
    const userReps = await userData.reps;
    const userBackground = await userData.background;
    var userAboutMe = await userData.aboutme;
    const userMarry = await userData.marry;

    if (userAboutMe == null) {
      userAboutMe = "Foxy é minha amiga (você pode alterar isso usando f!aboutme)!";
    }

    const canvas = Canvas.createCanvas(1436, 884);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage(`./src/assets/backgrounds/${userBackground}`);

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);


    ctx.font = '70px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${userMention.username}`, canvas.width / 6.0, canvas.height / 9.5);

    ctx.font = '40px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Reps: ${userReps} \nCarteira: ${userMoney}`, canvas.width / 1.5, canvas.height / 7.0);

    if (userMarry !== null) {
      let user2 = await userData.marry;
      const discordProfile = await client.users.fetch(user2);
      ctx.font = '30px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`💍 Casado com: ${discordProfile.tag}`, canvas.width / 6.0, canvas.height / 6.0);
    }

    if(userData.premium) {
      ctx.font = '30px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`🔑 Premium`, canvas.width / 6.0, canvas.height / 4.5);
    }
    ctx.font = ('30px sans-serif');
    ctx.fillStyle = '#ffffff';
    ctx.fillText(userAboutMe, canvas.width / 55.0, canvas.height / 1.2);

    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await Canvas.loadImage(userMention.displayAvatarURL({ format: 'png' }));
    ctx.drawImage(avatar, 25, 25, 200, 200);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `foxy_profile.png`);
    message.foxyReply(attachment);
  },
};