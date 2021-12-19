const { ShardingManager } = require("discord.js");
const shard = new ShardingManager("./Foxy.js", {
    respawn: true,
    totalShards: 1,
});

shard.on("shardCreate", (shard) => {
    console.info(`\x1b[37m\x1b[105mSHARD\x1b[0m: Shard ${Number(shard.id) + 1} foi iniciada!`);
})

shard.spawn();

process.on('uncaughtException', err => {
    console.error('\x1b[37m\x1b[41mERROR\x1b[0m: Um erro inesperado e GRAVE ocorreu!\n', err);
    process.exit(1);

});

process.on('unhandledRejection', err => {
    console.error('\x1b[37m\x1b[41mERROR\x1b[0m: Um erro inesperado ocorreu!\n', err);
});

