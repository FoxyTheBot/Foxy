module.exports = class GuildCreate {
    constructor(client) {
        this.client = client;
    }

    async run(guild) {
        this.client.webhookClient.guildCreate(guild);
    }
}