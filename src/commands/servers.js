const Discord = require('discord.js')

module.exports.run = async(client, message, channel) => {
    const promises = [
        client.shard.fetchClientValues('guilds.cache.size'),
        client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)'),
      ];
      
      Promise.all(promises)
        .then(results => {
          const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
          const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
        
    message.channel.send(`Em ${totalGuilds} servidores`)
        })
}