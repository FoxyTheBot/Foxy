module.exports = class ShardDisconnect {
    constructor(client) {
        this.client = client;
    }

    async run(shard) {
        console.warn(`\x1b[37m\x1b[105mSHARD\x1b[0m: Shard ${Number(shard) + 1} foi desconectada do Discord`);
    }
}