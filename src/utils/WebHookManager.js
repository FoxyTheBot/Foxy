const { MessageEmbed } = require('discord.js')

module.exports = async (client, message) => {

    const logsWebhook = new WebhookClient(client.config.logs.id, client.config.logs.token);
    const reportWebhook = new WebhookClient(client.config.report.id, client.config.report.token);
    const suggestWebhook = new WebhookClient(client.config.suggest.id, client.config.suggest.token);

    module.exports = function reportHook() {
        const embed = new Discord.MessageEmbed()
            .setTitle('<:meowbughunter:776249240463736834> | Report para Foxy')
            .setColor('#0099ff')
            .setDescription(`Autor: **${message.author.username} / ${message.author.id}** \n Servidor: ${message.guild.name} \n ${message.guild.id} \n\n ${client.emotes.bug} **Issue:** ${sayMessage}`);
        const pfp = message.author.avatarURL();
        reportWebhook.send({
            username: `${message.author.username}`,
            avatarURL: pfp,
            embeds: [embed],
        });
    }

    module.exports = function suggestHook() {
        const pfp = message.author.avatarURL();
        const suggest = new MessageEmbed()
            .setColor(client.colors.rp)
            .setTitle('Nova sugestão para a Foxy!')
            .setThumbnail(pfp)
            .setDescription(`${client.emotes.heart} **Usuário:** ${message.author.username} / ${message.author.id} \n\n ${client.emotes.success} **Sugestão:** ${suggestion} \n\n ${client.emotes.thumbsup} **Servidor:** ${message.guild.name} / ${message.guild.id}`);
        suggestWebhook.send(suggest);
    }

    module.exports = function logsHook() {
        const logs = new Discord.MessageEmbed()
            .setTitle('Logs de comandos')
            .setDescription(`**Comando:** f!say \n **Autor:** ${message.author.tag} / ${message.author.id} \n\n **Servidor** ${message.guild.name} / ${message.guild.id} \n\n **Mensagem:** ${sayMessage} \n\n Link: [Mensagem](${message.url})`);
        logsWebhook.send({
            username: 'Logs',
            avatarURL: 'https://cdn.discordapp.com/attachments/766414535396425739/789255465125150732/sad.jpeg',
            embeds: [logs],
        });
    }


}








