module.exports = class ShardError {
    constructor(client) {
        this.client = client;
    }

    async run(shard, err) {
        console.error(`\x1b[37m\x1b[105mSHARD\x1b[0m: Ocorreu um erro na shard ${Number(shard) + 1}! | ${err}`);
    }
}