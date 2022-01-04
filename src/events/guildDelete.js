module.exports = class GuildDelete {
    constructor(client) {
        this.client = client;
    }

    async run(guild) {
        if(!guild) return;
        this.client.WebhookManager.guildDelete(guild);
    }
}