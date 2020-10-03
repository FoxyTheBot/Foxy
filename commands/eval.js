const Discord = require("discord.js");
const os = require("os");

module.exports.run = async (client, message, args) =>{
    if(message.author.id != "708493555768885338") return message.channel.send(`<:Error:718944903886930013> | ${message.author} Apenas pessoas especiais podem usar este comando :3 \n Sua ID: ${message.author.id} não foi encontrada nos meus arquivos.`)
    let cpu = Math.round(process.cpuUsage().system / 1024 / 1024).toString()
    if(cpu < 1) {
        cpu = (process.cpuUsage().system / 1024 / 1024).toFixed()
    }
    let ram = Math.round(process.memoryUsage().rss / 1024 / 1024).toString()
    let modelo = os.cpus().map((i) => `${i.model}`)[0]
    const status = new Discord.MessageEmbed()
    .setTitle('<:DiscordStaff:731947814246154240> Painel de Informações Restritas <:DiscordStaff:731947814246154240>')
    .setDescription(`<a:ping2:754144264161591336> API: ${Math.round(client.ws.ping)}ms \n Servidores: ${client.guilds.cache.size}`)
    .setThumbnail('https://cdn.discordapp.com/avatars/737044809650274325/64b92e7d5e7fb48e977e1f04ef13369d.png?size=1024')
    .addField(`Uso da CPU`, `${cpu}%`, true)
    .addField(`Uso da RAM:`, `${ram}MB`, true)
    .addField(`Modelo da CPU`, `${modelo}`)
    .setImage('https://cdn.discordapp.com/splashes/709847600467148801/983a9e668c4483ecf1cd69eb5d58c96b.png?size=2048')
    message.channel.send(status)
}