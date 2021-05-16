const { MessageAttachment } = require('discord.js')

module.exports = {
    name: 'teste',
    aliases: ['teste'],
    cooldown: 3,
    guildOnly: true,
    ownerOnly: false,
    clientPerms: ['ATTACH_FILES', 'EMBED_LINKS'],

    async run(client, message, args) {

        var videos = [
            'https://cdn.discordapp.com/attachments/776930851753426945/843468720156049428/y2mate.com_-_Sapo_dancando_violentamente_ao_som_de_Bruno_Barreto_480p.mp4',
            'https://cdn.discordapp.com/attachments/782995363548102676/832711244384960571/conha_maconha_maconha_conha_maconha240P.mp4',
        ]

        const rand = videos[Math.floor(Math.random() * videos.length)];
        const attachment = new MessageAttachment(rand, 'maconha_conha.mp4')
        message.FoxyReply(attachment)
    },

};