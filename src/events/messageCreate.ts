import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import i18next from 'i18next';

export default class MessageCreate {
    public client: any;
    constructor(client) {
        this.client = client;
    }

    async run(message) {

        const user = await this.client.database.getUser(message.author.id);
        let t = global.t = i18next.getFixedT(user.lang || 'pt-BR');

        if (message.content === `<@${this.client.user.id}>` || message.content === `<@!${this.client.user.id}>`) message.channel.send(`Olá ${message.author}! Meu nome é ${this.client.user.username}, meu prefixo é \`/(Slash Commands)\`, Utilize \`/help\` para obter ajuda! ${this.client.emotes.success}`);

        if (message.author.bot) return;
        const row = new MessageActionRow();
        row.addComponents(
            new MessageButton()
                .setURL("https://discord.com/oauth2/authorize?client_id=737044809650274325&scope=bot+applications.commands&permissions=269872255")
                .setLabel(t('oldcmd.button'))
                .setStyle('LINK'),
        );

        const messageError = new MessageEmbed();
        messageError.setColor("#ff0000");
        messageError.setTitle(t('oldcmd.title'));
        messageError.setDescription(t('oldcmd.description'));
        messageError.setImage("https://i.imgur.com/GBoGyrC.gif");

        if (message.content.startsWith(this.client.config.prefix)) {
            return message.reply({ embeds: [messageError], components: [row] });
        }
    }
}