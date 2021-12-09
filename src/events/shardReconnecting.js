module.exports = class ShardReconnecting {
    constructor(client) {
        this.client = client;
    }

 async run(shard) {
     console.info(`\x1b[37m\x1b[105mSHARD\x1b[0m: Shard ${Number(shard) + 1} está tentando se reconectar ao Discord`);
 }
}