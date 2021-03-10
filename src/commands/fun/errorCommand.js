const Discord = require('discord.js');
const Canvas = require('canvas');

module.exports = {
  name: 'error',
  aliases: ['error', 'erro'],
  cooldown: 3,
  guildOnly: true,
  async run(client, message, args, applyText) {
    if (!message.guild.me.permissions.has('ATTACH_FILES')) return message.reply('Eu preciso da permissão `enviar arquvios` para fazer isso!');


    const canvas = Canvas.createCanvas(380, 208);
    const ctx = canvas.getContext('2d');
    const sayMessage = args.join(' ');
    if (!sayMessage) return message.reply('Digite algo antes');
        message.channel.startTyping();
    const background = await Canvas.loadImage('./src/assets/Windows.png');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    if (sayMessage.length > 30) return message.reply('Você pode digitar até 30 caracteres, obrigada :3');
    message.channel.stopTyping();

    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Slightly smaller text placed above the member's display name
    ctx.font = '15px Sans';
    ctx.fillStyle = '#000000';
    ctx.fillText(`${sayMessage}`, canvas.width / 5.3, canvas.height / 2.2);

    // Add an exclamation point here and below

    ctx.beginPath();
    ctx.arc(125, 125, 100, 6, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'error.png');

    message.reply(attachment);
    const embed = new Discord.MessageEmbed()
      .setTitle('Logs de comandos')
      .setDescription(`**Comando:** f!error \n **Autor:** ${message.author.tag} / ${message.author.id} \n\n **Servidor** ${message.guild.name} / ${message.guild.id} \n\n **Mensagem:** ${sayMessage} \n\n Link: [Mensagem](${message.url})`);

    client.logsWebhook.send({
      username: 'Logs',
      avatarURL: 'https://cdn.discordapp.com/attachments/766414535396425739/789255465125150732/sad.jpeg',
      embeds: [embed],
    });
  },
};
