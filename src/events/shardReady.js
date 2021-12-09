module.exports = class ShardReady {
    constructor(client) {
        this.client = client;
    }

    async run(shard) {
        console.info(`Shard ${Number(shard) + 1} se conectou ao Discord!`);
    }
}