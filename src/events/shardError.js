module.exports = class ShardError {
    constructor(client) {
        this.client = client;
    }

    async run(shard, err) {
        console.error(`[SHARD] Ocorreu um erro na shard ${Number(shard) + 1}! | ${err}`);
    }
}