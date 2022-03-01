import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import i18next from 'i18next';

export default class MessageCreate {
    public client: any;
    constructor(client) {
        this.client = client;
    }

    async run(message): Promise<any> {
        if (message.author.bot) return;
        const user = await this.client.database.getUserLocale(message.author.id);
        let t = global.t = i18next.getFixedT(user.locale || 'en-US');

        if (message.content === `<@${this.client.user.id}>` || message.content === `<@!${this.client.user.id}>`) message.channel.send(`${message.author} ${t('events:messageCreate.hello')}!`);

        if (message.author.bot) return;
        const row = new MessageActionRow();
        row.addComponents(
            new MessageButton()
                .setURL("https://discord.com/oauth2/authorize?client_id=737044809650274325&scope=bot+applications.commands&permissions=269872255")
                .setLabel(t('events:slash.button'))
                .setStyle('LINK'),
        );

        const messageError = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle(t('events:slash.title'))
            .setDescription(t('events:slash.description'))
            .setImage("https://i.imgur.com/GBoGyrC.gif")

        if (message.content.startsWith(this.client.config.prefix)) {
            return message.reply({ embeds: [messageError], components: [row] });
        }
    }
}