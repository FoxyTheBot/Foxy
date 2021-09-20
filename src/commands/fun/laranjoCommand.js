const Discord = require('discord.js');
const Canvas = require('canvas');

module.exports = {
  name: 'laranjo',
  aiases: ['laranjo'],
  cooldown: 3,
  guildOnly: true,
  clientPerms: ['ATTACH_FILES', 'READ_MESSAGE_HISTORY'],

  async run(client, message, args) {
    if (!message.guild.me.permissions.has('ATTACH_FILES')) return message.foxyReply('Eu preciso da permissão `enviar arquvios` para fazer isso!');


    const canvas = Canvas.createCanvas(700, 600);
    const ctx = canvas.getContext('2d');
    const sayMessage = args.join(' ');
    if (!sayMessage) return message.foxyReply('Digite algo antes');
    

    const background = await Canvas.loadImage('./src/assets/laranjo.jpeg');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.font = '33px sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(`${sayMessage}`, canvas.width / 15.5, canvas.height / 13.5);

    ctx.beginPath();
    ctx.arc(125, 125, 100, 6, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'laranjo.png');
    

    message.foxyReply(attachment);
    
    const logs = new Discord.MessageEmbed()
    .setTitle('Logs de comandos')
    .setDescription(`**Comando:** laranjoCommand \n **Autor:** ${message.author.tag} / ${message.author.id} \n\n **Servidor** ${message.guild.name} / ${message.guild.id} \n\n **Mensagem:** ${message.content} \n\n Link: [Mensagem](${message.url})`);
  client.logsWebhook.send(logs);
  },

};
