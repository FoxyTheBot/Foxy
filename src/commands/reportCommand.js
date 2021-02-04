const Discord = require('discord.js');

module.exports = {
name: "report",
aliases: ['reportar', 'report', 'bug', 'issue'],
cooldown: 3,
guildOnly: true,
async execute(client, message, args) {
    const webhookClient = new Discord.WebhookClient("WEBHOOK-ID", "WEBHOOK-TOKEN");
    const sayMessage = args.join(' ');
          const noargs = new Discord.MessageEmbed()
.setColor('BLUE')
.setTitle('Como usar')
.setDescription('<:meowbughunter:776249240463736834> **Reporte falhas para meu servidor de suporte** \n 💁‍♀️ **Exemplo:** `f!report bot retorna undefined`')

if (!sayMessage) return message.channel.send(noargs)
    message.channel.send(`Obrigada por me ajudar ${message.author}, seu report foi enviado com sucesso! <:meow_blush:768292358458179595>`)
    const embed = new Discord.MessageEmbed()
        .setTitle(`<:meowbughunter:776249240463736834> | Report para Foxy`)
        .setColor('#0099ff')
        .setDescription(`Autor: **${message.author.username} / ${message.author.id}** \n Servidor: ${message.guild.name} \n ${message.guild.id} \n\n <:bug_hunter:789668194494709761> **Issue:** ${sayMessage}`)
        let pfp = message.author.avatarURL();
    webhookClient.send( {
        username: `${message.author.username}`,
        avatarURL: pfp,
        embeds: [embed],
    });
}

}