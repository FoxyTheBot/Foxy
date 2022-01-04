module.exports = class ShardReady {
    constructor(client) {
        this.client = client;
    }

    async run(shard) {
        console.info('[' + color("SHARD", 35) + '] ' + `Shard ${Number(shard) + 1} se conectou ao Discord!`);
    }
}