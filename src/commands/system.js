const Discord = require("discord.js");
const os = require("os");


module.exports.run = async (client, message, args) =>{
            console.log(`Usuário ${message.author.tag} tentou acessar o painel do sistema`)
    let error = new Discord.MessageEmbed()
    .setTitle('Access Denied')
    .setDescription('Apenas pessoas autorizadas!')
    .setThumbnail('https://cdn.discordapp.com/attachments/766414535396425739/769241451371692072/PngItem_1646925.png')
      if(message.author.id != "708493555768885338") return message.channel.send(error)
  message.delete().catch(O_o => {});
 
let stats = new Discord.MessageEmbed()
.setTitle('Logs do sistema aqui!')
.setURL('https://painel.rocket-host.ml/server/77185ac5')
.setFooter('Não compartilhe sua senha!')
message.channel.send(stats)
console.log(`Usuário ${message.author.tag} Obteve o link do painel`)

}