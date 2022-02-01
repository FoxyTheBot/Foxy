export default class GuildCreate {
    public client: any;
    constructor(client) {
        this.client = client;
    }

    async run(guild) {
        this.client.WebhookManager.guildCreate(guild);
        this.client.database.getGuild(guild.id);
    }
}