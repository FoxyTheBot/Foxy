const shell = require('shelljs');
const colors = require('./src/structures/color');

if (process.platform === 'win32') {
  shell.exec('cls');
} else {
  shell.exec('clear');
}
const {
  ShardingManager, WebhookClient, Client, MessageEmbed,
} = require('discord.js');

const client = new Client();
const { token, shard, statusWebhook } = require('./config');

client.statusWebhook = new WebhookClient(statusWebhook.id, statusWebhook.token);
const manager = new ShardingManager('./src/FoxyClient.js', { token, totalShards: shard });

manager.on('message', (shard, message) => {
  console.info(`Shard[${shard.id}] : ${message._eval} : ${message._result}`);
});

manager.on('shardCreate', (shard) => {
  const create = new MessageEmbed()
    .setTitle('Foxy is Starting!')
    .setDescription(`Shard ${shard.id} está iniciando`)
    .setColor(colors.default)
    .setThumbnail('https://cdn.discordapp.com/attachments/776930851753426945/811265109728034846/Foxy.png');
  client.statusWebhook.send(create);
  console.info(`\x1b[37m\x1b[105mSHARD\x1b[0m: Iniciando Shard ${shard.id}`);
});
manager.spawn();

process.on('SIGINT', () => {
  const sigint = new MessageEmbed()
    .setTitle('Foxy is sleeping')
    .setDescription('Foxy está a mimir shiii <a:sleeepy:803647820867174421>')
    .setColor(colors.default)
    .setThumbnail('https://cdn.discordapp.com/attachments/776930851753426945/811265109728034846/Foxy.png');
  client.statusWebhook.send(sigint);
  console.info('\n\x1b[37m\x1b[44mINFO\x1b[0m: Foxy está a mimir');
  process.exit(1);
});

process.on('uncaughtException', (stderr) => {
  const error = new MessageEmbed()
    .setTitle('Um erro GRAVE ocorreu durante a inicialização')
    .setDescription('Foxy não conseguiu se conectar ao Discord!')
    .setColor(colors.error)
    .setThumbnail('https://cdn.discordapp.com/attachments/776930851753426945/811265109728034846/Foxy.png');
  client.statusWebhook.send(error);
  console.error('\x1b[37m\x1b[41mERROR\x1b[0m: Um erro inesperado e GRAVE ocorreu!\n', stderr);
  process.exit(1);
});

process.on('unhandledRejection', (stderr) => {
  const error = new MessageEmbed()
    .setTitle('Um erro ocorreu durante a inicialização')
    .setDescription('Foxy não foi inicializada corretamente')
    .setColor(colors.error)
    .setThumbnail('https://cdn.discordapp.com/attachments/776930851753426945/811265109728034846/Foxy.png');
  client.statusWebhook.send(error);
  console.error('\x1b[37m\x1b[41mERROR\x1b[0m: Um erro inesperado ocorreu!\n', stderr);
});
