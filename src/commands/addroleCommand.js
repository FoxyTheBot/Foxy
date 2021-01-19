const Discord = require('discord.js')
const { prefix } = require('../config.json')
module.exports = {
    name: "addrole",
    aliases: ['addrole', 'adicionarcargo', 'cargo'],
    cooldown: 3,
    guildOnly: true,

async execute(client, message, args) {
  
 let username = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
 
if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply("Você não tem permissão `Gerenciar Cargos`") 

if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.reply("Eu não tenho permissão `Gerenciar Cargos`")

 if(!username) return message.reply(`Forneça um usuário válido para eu adicionar um cargo a ele. Use ${prefix}addrole <user> <cargo>`)
 let cargo = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(x => x.name === args.join(" "))
 
 if(!cargo) return message.reply(`Forneça um cargo válido para eu adicionar ao usuário. Use ${prefix}addrole <user> <cargo>`)
 
 username.roles.add(cargo)
 
 const embed = new Discord.MessageEmbed()
 .setDescription(`**O cargo ${cargo} foi adicionado ao usuário ${username}**`)
 .setColor('RANDOM')
 
 
 message.channel.send(embed)
}
}