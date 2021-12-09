module.exports = class ShardReconnecting {
    constructor(client) {
        this.client = client;
    }

 async run(shard) {
     console.info(`Shard ${Number(shard) + 1} está tentando se reconectar ao Discord`);
 }
}