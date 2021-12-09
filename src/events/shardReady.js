module.exports = class ShardReady {
    constructor(client) {
        this.client = client;
    }

    async run(shard) {
        console.info(`Shard ${shard} se conectou ao Discord!`);
    }
}