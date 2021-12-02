const { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require('discord.js');

module.exports = class MessageCreate {
    constructor(client) {
        this.client = client;
    }

    async run(message) {
        if (message.author.bot) return;
        const row = new MessageActionRow();
        row.addComponents(
            new MessageButton()
                .setURL("https://discord.com/oauth2/authorize?client_id=737044809650274325&scope=bot+applications.commands&permissions=269872255")
                .setLabel('Atualize minhas permissões')
                .setStyle('LINK'),
        );
        const attachment = new MessageAttachment("https://cdn.foxywebsite.ml/alert/error.mp4", "sejaslash.mp4");
        if (message.content.startsWith(this.client.config.prefix)) {
            return message.reply({ files: [attachment], components: [row], ephemeral: true });
        }
    }
}