const db = require('quick.db');
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "lockinvites",
    aliases: ['bloquear', 'bloquearconvites', 'noinvites', 'lockinvites', 'lockinvite'],
    guildOnly: true,
    cooldown: 7,
    clientPerms: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],

    async run(client, message, args) {

        if (!message.member.permissions.has('MANAGE_CHANNELS')) {
            return message.foxyReply(
                `<:WindowsShield:777579023249178625> **|** ${message.author} Você não tem permissão para executar este comando! Você precisará da permissão \`Gerenciar Canais\``,
            );
        }

        switch (args[0]) {

            case 'on': {
                const channel = message.mentions.channels.first()

                if (!channel) return message.foxyReply("Mencione um canal para divulgações!")

                var channelid = db.fetch(`guild_${message.guild.id}`)

                db.set(`guild_${message.guild.id}`, channel.id);
                message.foxyReply(`Agora convites só poderão ser enviados em <#${channel.id}>`)

            }
                break;
            case 'off': {
                if (channelid === null) return message.foxyReply("Não existe canal de divulgação definido!")
                message.foxyReply(`${client.emotes.scared} **|** Você deseja desativar o bloqueio de convites em outros canais?`).then(msg => {
                    msg.react('✅')

                    const filterYes = (reaction, usuario) => reaction.emoji.name === '✅' && usuario.id === message.author.id;
                    const yesCollector = msg.createReactionCollector(filterYes, { max: 1, time: 60000 });

                    yesCollector.on('collect', () => {
                        message.foxyReply(`Agora links de servidores serão permitidos em todos os canais do servidor!`);

                        db.delete(`guild_${message.guild.id}`)
                    })
                })

                break;
            }

            default: {
                const noargs = new MessageEmbed()
                    .setColor(client.colors.blurple)
                    .setTitle("Bloqueio de convites")
                    .setDescription("Bloqueie convites em todos os canais e coloque um canal específico para divulgação")
                    .addFields(
                        { name: "✔ Definindo canal", value: "f!lockinvite on <#Menção do canal>" },
                        { name: "❌ Removendo canal", value: "f!lockinvite off" }
                    )
                message.foxyReply(noargs)
            }
        }
    }
}