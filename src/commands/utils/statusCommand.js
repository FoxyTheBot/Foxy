const { version, MessageEmbed } = require('discord.js');
const os = require('os');
const cpuStat = require('cpu-stat');
const moment = require('moment');

module.exports = {
  name: 'status',
  aliases: ['status', 'stts'],
  cooldown: 3,
  guildOnly: false,
  async run(client, message) {
    
    moment.locale('pt-br');
    const promises = [
      client.shard.fetchClientValues('guilds.cache.size'),
      client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)'),
    ];

    Promise.all(promises)
      .then((results) => {
        const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
        const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);

        cpuStat.usagePercent((err, percent) => {
          const status = new MessageEmbed()
            .setTitle('Status')
            .addField(('CPU Name:'), `\`\`\`${os.cpus().map((i) => `${i.model}`)[0]}\`\`\``)
            .addField(('Memória Utilizada:'), `\`\`\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB\`\`\``, true)
            .addField(('CPU:'), `\`\`\`${percent.toFixed(2)}%\`\`\``, true)
            .addField(('Plataforma:'), `\`\`\`${os.platform()} ${os.arch()}\`\`\``, true)
            .addField(('Versão:'), `\`\`\`${require('../../../package.json').version}\`\`\``, true)
            .addField(('discord.js:'), `\`\`\`${version}\`\`\``, true)
            .setFooter(`${totalGuilds} Servidores e ${totalMembers} Usuários`);
          
          message.inlineReply(status);
        });
      }).catch(console.error);
  },

};
