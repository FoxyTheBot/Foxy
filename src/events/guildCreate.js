module.exports = class GuildCreate {
    constructor(client) {
        this.client = client;
    }

    async run(guild) {
        if(!guild) return;
        this.client.WebhookManager.guildCreate(guild);
    }
}