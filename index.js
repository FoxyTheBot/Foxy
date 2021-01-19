const shell = require('shelljs');
shell.exec('clear');
const { ShardingManager } = require('discord.js');
const {token, shard } = require('./src/config')
const manager = new ShardingManager('./src/FoxyClient.js', { token: token, totalShards: shard });

manager.on('message', (shard, message) => {
    console.log(`Shard[${shard.id}] : ${message._eval} : ${message._result}`);
});

manager.on('shardCreate', shard => {
    console.log(`[SHARD MANAGER] Launching Shard ${shard.id}`)
}
);
manager.spawn();