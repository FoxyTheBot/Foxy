export default class GuildDelete {
    public client: any;
    constructor(client) {
        this.client = client;
    }

    async run(guild) {
        this.client.WebhookManager.guildDelete(guild);
        this.client.database.deleteGuild(guild.id);
    }
}