import i18next from 'i18next';

export default class MessageCreate {
    public client: any;
    constructor(client) {
        this.client = client;
    }

    async run(message): Promise<any> {
        if (message.author.bot) return;
        const user = await this.client.database.getUser(message.author.id);
        let t = global.t = i18next.getFixedT(user.language || 'en-US');

        if (message.content === `<@${this.client.user.id}>` || message.content === `<@!${this.client.user.id}>`) message.channel.send(`${message.author} ${t('events:messageCreate.hello')}!`);
    }
}