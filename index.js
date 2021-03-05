const shell = require('shelljs');
const colors = require('./src/structures/color')
if (process.platform === 'win32') {
    shell.exec('cls');
} else {
    shell.exec('clear');
}
const { ShardingManager, WebhookClient, Client, MessageEmbed } = require('discord.js');
const client = new Client()
const { token, shard, statusWebhook } = require('./config')
client.statusWebhook = new WebhookClient(statusWebhook.id, statusWebhook.token);
const manager = new ShardingManager('./src/FoxyClient.js', { token: token, totalShards: shard, });


manager.on('message', (shard, message) => {
    console.info(`Shard[${shard.id}] : ${message._eval} : ${message._result}`);
});

manager.on('shardCreate', shard => {

    console.info(`\x1b[37m\x1b[105mSHARD\x1b[0m: Iniciando Shard ${shard.id}`)
}
);
manager.spawn();

process.on('SIGINT', () => {

    console.info('\n\x1b[37m\x1b[44mINFO\x1b[0m: Foxy está a mimir');
    process.exit(1)
});

process.on('uncaughtException', stderr => {

    console.error('\x1b[37m\x1b[41mERROR\x1b[0m: Um erro inesperado e GRAVE ocorreu!\n', stderr);
    process.exit(1);

});

process.on('unhandledRejection', stderr => {

    console.error('\x1b[37m\x1b[41mERROR\x1b[0m: Um erro inesperado ocorreu!\n', stderr);
});
