const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

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
        const messageError = new MessageEmbed();
        messageError.setColor("#ff0000");
        messageError.setTitle("Não é possível mais usar os comandos tradicionais da Foxy!");
        messageError.setDescription("Estou respondendo apenas Slash Commands (Comandos de barra /). Digite /ping caso não apareça os meus comandos atualize minhas permissões no seu servidor! \n\n **Maneiras de atualizar: **" +
        "Para atualizar você pode atualizar pelo [link](https://discord.com/oauth2/authorize?client_id=737044809650274325&scope=bot+applications.commands&permissions=269872255) ou usando a nova função do Discord:");
        messageError.setImage("https://i.imgur.com/GBoGyrC.gif");
            
        if (message.content.startsWith(this.client.config.prefix)) {
            return message.reply({ embeds: [messageError] });
        }
    }
}