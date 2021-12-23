const Discord = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    name: 'notstonks',
    aliases: ['notstonks'],
    cooldown: 3,
    guildOnly: true,
    clientPerms: ['ATTACH_FILES', 'READ_MESSAGE_HISTORY'],

    async run(client, message, args) {
        if (!message.guild.me.permissions.has('ATTACH_FILES')) return message.reply('Eu preciso da permissão `enviar arquvios` para fazer isso!');

        const canvas = Canvas.createCanvas(800, 600);
        const ctx = canvas.getContext('2d');
        const sayMessage = args.join(' ');
        if (!sayMessage) return message.reply('Digite algo antes');
        if(sayMessage.length > 35) return message.reply("Digite até 35 caractéres")
        

        const background = await Canvas.loadImage('./src/assets/notstonks.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        ctx.font = '40px sans-serif';
        ctx.fillStyle = '#000000';
        ctx.fillText(`${sayMessage}`, canvas.width / 13.1, canvas.height / 14.1);

        ctx.beginPath();
        ctx.arc(125, 125, 100, 6, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'stonks.png');
        

        message.reply(attachment);
        
        const logs = new Discord.MessageEmbed()
        .setTitle('Logs de comandos')
        .setDescription(`**Comando:** notStonksCommand \n **Autor:** ${message.author.tag} / ${message.author.id} \n\n **Servidor** ${message.guild.name} / ${message.guild.id} \n\n **Mensagem:** ${message.content} \n\n Link: [Mensagem](${message.url})`);
      client.logsWebhook.send({
        username: 'Logs',
        avatarURL: 'https://cdn.discordapp.com/attachments/766414535396425739/789255465125150732/sad.jpeg',
        embeds: [logs],
      });

    },
};
