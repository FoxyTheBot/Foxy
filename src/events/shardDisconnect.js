module.exports = class ShardDisconnect {
    constructor(client) {
        this.client = client;
    }

    async run(shard) {
        console.warn(`Shard ${Number(shard) + 1} foi desconectada do Discord`);
    }
}