const Discord = require("discord.js");

const os = require("os");


module.exports.run = async (client, message, args) =>{
  
  message.delete().catch(O_o => {});
  
  
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
    .addField(`Servidores`, `${client.guilds.cache.size}`)
    .addField(`Ping API`, `${Math.round(
      client.ws.ping
    )}ms`)
    message.channel.send(status)
}