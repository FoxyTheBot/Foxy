export default class GuildCreate {
    public client: any;
    constructor(client) {
        this.client = client;
    }

    async run(guild): Promise<void> {
        this.client.WebhookManager.guildCreate(guild);
    }
}