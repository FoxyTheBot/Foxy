module.exports = class ShardReady {
    constructor(client) {
        this.client = client;
    }

    async run(shard) {
        console.info(`Shard ${shard.id} se conectou ao Discord!`);
    }
}