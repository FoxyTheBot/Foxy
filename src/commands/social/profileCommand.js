const Discord = require('discord.js');
const Canvas = require('canvas');

module.exports = {
  name: 'profile',
  aliases: ['profile', 'perfil'],
  cooldown: 5,
  guildOnly: true,
  clientPerms: ['ATTACH_FILES', 'READ_MESSAGE_HISTORY'],

  async run(client, message) {
    const userMention = message.mentions.users.first() || message.author;
    const userData = await client.db.getDocument(userMention.id);

    if(!userData) return message.reply(`${client.emotes.error} **|** Este usuário não está no meu banco de dados, bobinho`);

    const userMoney = await userData.balance;
    const userReps = await userData.repCount;
    const userBackground = await userData.background;
    const userMarry = await userData.marriedWith;

    var userAboutMe = await userData.aboutme;

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
      const discordProfile = await client.users.fetch(userMarry);
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
    message.channel.startTyping();
    await message.reply(attachment);
    message.channel.stopTyping();
  },
};