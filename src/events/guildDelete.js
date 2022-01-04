module.exports = class GuildDelete {
    constructor(client) {
        this.client = client;
    }

    async run(guild) {
        this.client.WebhookManager.guildDelete(guild);
    }
}