const Discord = require("discord.js");

const os = require("os");


module.exports = {
  name: "status",
  aliases: ['status', 'stts'],
  cooldown: 3,
  guildOnly: false,
async execute(client, message, args) {
  
  const promises = [
    client.shard.fetchClientValues('guilds.cache.size'),
    client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)'),
  ];
  
  Promise.all(promises)
    .then(results => {
      const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
      const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
      let cpu = Math.round(process.cpuUsage().system / 1024 / 1024).toString()
      if(cpu < 1) {
          cpu = (process.cpuUsage().system / 1024 / 1024).toFixed()
      }
      let ram = Math.round(process.memoryUsage().rss / 1024 / 1024).toString()
      let modelo = os.cpus().map((i) => `${i.model}`)[0]
      const status = new Discord.MessageEmbed()
      .setTitle('<:DiscordStaff:731947814246154240> Status <:DiscordStaff:731947814246154240>')
      .setDescription(`Status do bot`)
      .addField(`Uso da CPU`, `${cpu}%`, true)
      .addField(`Uso da RAM:`, `${ram}MB`, true)
      .addField(`Modelo da CPU`, `${modelo}`)
      .addField(`Servidores`, `${totalGuilds}`)
      .addField(`Users`, `${totalMembers}`)
      .addField(`Ping API`, `${Math.round(
        client.ws.ping
      )}ms`)
      .addField(`Shard:`, `${client.shard.ids}`)
      message.channel.send(status)
    })
    .catch(console.error);
  
 
}

}