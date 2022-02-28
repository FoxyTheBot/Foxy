export default class GuildDelete {
    public client: any;
    constructor(client) {
        this.client = client;
    }

    async run(guild): Promise<void> {
        this.client.WebhookManager.guildDelete(guild);
        await this.client.database.deleteGuild(guild.id);
    }
}