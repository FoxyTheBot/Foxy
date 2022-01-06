const { ShardingManager } = require("discord.js");
const shard = new ShardingManager("./index.js", {
    respawn: true,
    totalShards: 1,
});
require("./src/FoxyClient");

shard.on("shardCreate", (shard) => {
    console.info('[' + color("SHARD", 35) + '] ' + `Shard ${Number(shard.id) + 1} foi iniciada!`);
})

shard.spawn();

process.on('uncaughtException', err => {
    console.error('[' + color("SHARD", 31) + ']' + 'Um erro inesperado e GRAVE ocorreu!\n', err);
    process.exit(1);

});

process.on('unhandledRejection', err => {
    console.error('[' + color("SHARD", 31) + ']' + 'Um erro inesperado ocorreu!\n', err);
});

