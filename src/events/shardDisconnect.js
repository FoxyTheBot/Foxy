module.exports = class ShardDisconnect {
    constructor(client) {
        this.client = client;
    }

    async run(shard) {
        console.warn(`Shard ${shard.id} foi desconectada do Discord`);
    }
}