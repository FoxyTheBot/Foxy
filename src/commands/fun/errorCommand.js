const Discord = require('discord.js');
const Canvas = require('canvas');

module.exports = {
  name: 'error',
  aliases: ['error', 'erro'],
  cooldown: 3,
  guildOnly: true,
  clientPerms: ['ATTACH_FILES', 'READ_MESSAGE_HISTORY'],

  async run(client, message, args, applyText) {
    if (!message.guild.me.permissions.has('ATTACH_FILES')) return message.foxyReply('Eu preciso da permissão `enviar arquvios` para fazer isso!');


    const canvas = Canvas.createCanvas(380, 208);
    const ctx = canvas.getContext('2d');
    const sayMessage = args.join(' ');
    if (!sayMessage) return message.foxyReply('Digite algo antes');

    const background = await Canvas.loadImage('./src/assets/Windows.png');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    if (sayMessage.length > 30) return message.foxyReply('Você pode digitar até 30 caracteres, obrigada :3');


    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.font = '15px Sans';
    ctx.fillStyle = '#000000';
    ctx.fillText(`${sayMessage}`, canvas.width / 5.3, canvas.height / 2.2);

    ctx.beginPath();
    ctx.arc(125, 125, 100, 6, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'error.png');

    message.foxyReply(attachment);
    const logs = new Discord.MessageEmbed()
    .setTitle('Logs de comandos')
    .setDescription(`**Comando:** errorCommand \n **Autor:** ${message.author.tag} / ${message.author.id} \n\n **Servidor** ${message.guild.name} / ${message.guild.id} \n\n **Mensagem:** ${message.content} \n\n Link: [Mensagem](${message.url})`);
  client.logsWebhook.send({
    username: 'Logs',
    avatarURL: 'https://cdn.discordapp.com/attachments/766414535396425739/789255465125150732/sad.jpeg',
    embeds: [logs],
  });

  },
};
