const { MessageEmbed } = require('discord.js')
const user = require('../../structures/DatabaseConnection')

module.exports = {
    name: "foxyban",
    aliases: ['foxyban', 'blacklist', 'fb'],
    ownerOnly: true,
    guildOnly: true,

    async run(client, message, args) {
        if (!args[1]) return message.foxyReply(`${client.emotes.error} **|** Insira o ID da pessoa!`)

        const userban = await user.findOne({ userid: args[1] })

        const userfetch = await client.users.fetch(args[1]).catch();

        switch (args[0]) {
            case 'add': {
                if (!user || user === null) return message.foxyReply("Eu não encontrei esse usuário :(");
                const reason = args.slice(2).join(' ') || "Não quero saber! (Motivo não informado)";
                userban.userBanned = true;
                userban.banReason = reason;
                userban.bannedBy = message.author.username
                userban.save()

                message.foxyReply("Usuário banido!")
                break;
            }
            case 'remove': {
                if (!user || user === null) return message.foxyReply("Eu não encontrei esse usuário :(")
                userban.userBanned = false;
                userban.banReason = null;
                userban.bannedBy = null;
                userban.save()

                message.foxyReply("Usuário desbanido!")
                break;
            }

            case 'find': {
                if (!user || user === null) return message.foxyReply("Eu não encontrei esse usuário :( COLOCA A ID CORRETA PORRA")
                const findEmbed = new MessageEmbed()
                    .setColor(client.colors.blurple)
                    .setTitle("Ban Info")
                    .addFields(
                        { name: "User:", value: `${userfetch.tag} - ${userfetch.id}`, inline: true },
                        { name: "Banned:", value: userban.userBanned, inline: false },
                        { name: "Ban Info", value: userban.banReason, inline: false },
                        { name: "Banido por", value: userban.bannedBy, inline: false }
                    )
                message.foxyReply(findEmbed)
                break;
            }

            default: {
                message.foxyReply("Nhe, as opções são: `add`, `find`, `remove`")
            }
        }
    }
}