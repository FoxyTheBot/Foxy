const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "foxyban",
    aliases: ['foxyban', 'blacklist', 'fb'],
    ownerOnly: true,
    guildOnly: true,

    async run(client, message, args) {
        if (!args[1]) return message.reply(`${client.emotes.error} **|** Insira o ID da pessoa!`)

        const userban = await client.db.getDocument(args[1])

        if (!userban) return message.reply("Ain não achei ninguém UnU");

        const userfetch = await client.users.fetch(args[1]).catch();

        switch (args[0]) {
            case 'add': {
                const reason = args.slice(2).join(' ') || "Não quero saber! (Motivo não informado)";
                userban.isBanned = true;
                userban.banReason = reason;
                userban.banData = Date.now();
                userban.save()

                message.reply("Usuário banido!")
                break;
            }
            case 'remove': {
                userban.isBanned = false;
                userban.banReason = null;
                userban.banData = null;
                userban.save()

                message.reply("Usuário desbanido!")
                break;
            }

            case 'find': {
                const findEmbed = new MessageEmbed();
                findEmbed.setColor(client.colors.blurple);
                findEmbed.setTitle("Ban Info");
                findEmbed.addFields(
                    { name: "User:", value: `${userfetch.tag} - ${userfetch.id}`, inline: true },
                    { name: "Banned:", value: userban.isBanned, inline: false },
                    { name: "Ban Info", value: userban.banReason || "Nada" , inline: false },
                    { name: "Banido em", value: userban.banData.toLocaleString() || "Nada", inline: false }
                )
                message.reply(findEmbed)
                break;
            }

            default: {
                message.reply("Nhe, as opções são: `add`, `find`, `remove`");
            }
        }
    },
};