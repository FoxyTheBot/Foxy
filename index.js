const shell = require('shelljs');
shell.exec('clear');
const Discord = require('discord.js')
const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./src/FoxyClient.js', { token: 'BOT-TOKEN', totalShards: 5 });

manager.on('message', (shard, message) => {
    console.log(`Shard[${shard.id}] : ${message._eval} : ${message._result}`);
});

manager.on('shardCreate', shard => {
    console.log(`[SHARD MANAGER] Launching Shard ${shard.id}`)
}
);
manager.spawn();
