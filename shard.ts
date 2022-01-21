import { ShardingManager } from 'discord.js';
const manager = new ShardingManager("./build/index.js", {
    respawn: true,
    totalShards: 1,
});

manager.on("shardCreate", (shard: any) => {
    console.info(`[SHARD] - Shard ${Number(shard.id) + 1} has been created!`);
});

manager.spawn();

process.on('uncaughtException', err => {
    console.error('Um erro inesperado e GRAVE ocorreu!\n', err);
    process.exit(1);

});

process.on('unhandledRejection', err => {
    console.error('Um erro inesperado ocorreu!\n', err);
});