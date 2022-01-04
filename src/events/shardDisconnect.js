module.exports = class ShardDisconnect {
    constructor(client) {
        this.client = client;
    }

    async run(shard) {
        console.warn('[' + color("SHARD", 31) + '] ' + `Shard ${Number(shard) + 1} foi desconectada do Discord`);
    }
}