import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';

export default class MessageCreate {
    public client: any;
    constructor(client) {
        this.client = client;
    }

    async run(message) {
        if (message.content === `<@${this.client.user.id}>` || message.content === `<@!${this.client.user.id}>`) message.channel.send(`Olá ${message.author}! Meu nome é ${this.client.user.username}, meu prefixo é \`/(Slash Commands)\`, Utilize \`/help\` para obter ajuda! ${this.client.emotes.success}`);

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
        messageError.setDescription("Os comandos tradicionais foram descontinuados e substituidos pelos Slash Commands (Comandos de /).\nDigite `/ping` e verifique se aparece o meu comando de ping, caso não apareça atualize minhas permissões no seu servidor me re-convidando para o servidor :3" +
            "Para atualizar você pode atualizar pelo [link](https://discord.com/oauth2/authorize?client_id=737044809650274325&scope=bot+applications.commands&permissions=269872255) ou usando a nova função do Discord:");
        messageError.setImage("https://i.imgur.com/GBoGyrC.gif");

        if (message.content.startsWith(this.client.config.prefix)) {
            return message.reply({ embeds: [messageError] });
        }
    }
}