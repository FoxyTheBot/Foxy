import { ShardingManager } from 'discord.js';
const manager = new ShardingManager("./build/index.js", {
    respawn: true,
    totalShards: 1,
});

manager.on("shardCreate", (shard: any) => {
    console.info(`${new Date().toLocaleString()} [SHARDING MANAGER] - Shard ${Number(shard.id) + 1} has been created!`);
});

manager.spawn();

process.on('uncaughtException', err => {
    console.error('${new Date().toLocaleString()} [ERROR] - A Uncaught Exception has occurred\n', err);
    process.exit(1);

});

process.on('unhandledRejection', err => {
    console.error('${new Date().toLocaleString()} [ERROR] - A Unhandled Rejection has occurred\n', err);
});