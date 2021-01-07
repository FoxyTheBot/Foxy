const shell = require('shelljs');
shell.exec('clear');
const Discord = require('discord.js')
const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./FoxyClient.js', { token: 'YOUR-TOKEN', totalShards: 5 });

manager.on('message', (shard, message) => {
    console.log(`Shard[${shard.id}] : ${message._eval} : ${message._result}`);
});

manager.on('shardCreate', shard => {
    console.log(`[SHARD MANAGER] Launching Shard ${shard.id}`)
const webhookClient = new Discord.WebhookClient("WEBHOOK-ID", "YOUR-WEBHOOK-TOKEN");
const embed = new Discord.MessageEmbed()
    .setColor('BLUE')
    .setTitle('SHARD MANAGER')
    .setDescription(`[SHARD MANAGER] Launching Shard ${shard.id}`)
webhookClient.send({
    username: `BOOT`,
    avatarURL: 'https://cdn.discordapp.com/attachments/776930851753426945/792761877146107984/240px-Microsoft_Cortana_transparent.png',
    embeds: [embed],
})
    }
);
manager.spawn();