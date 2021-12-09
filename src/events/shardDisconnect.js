module.exports = class ShardDisconnect {
    constructor(client) {
        this.client = client;
    }

    async run(shard) {
        console.warn(`Shard ${shard} foi desconectada do Discord`);
    }
}