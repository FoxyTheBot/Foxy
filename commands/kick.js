const Discord = require('discord.js')

module.exports.run = (client, message, args) => {

    if(message.guild === null)return;

     
 
  {
         
            let role = message.member.hasPermission('KICK_MEMBERS')
   if(!message.member.hasPermission('KICK_MEMBERS'))
     return message.reply("<:nao:749403722488217610> Você não tem permissão para executar esse comando!");
   
   let member = message.mentions.members.first() || message.guild.members.get(args[0]);
   if(!member)
     return message.reply("Mencione um usuário valido!");
   if(!member.kickable) 
     return message.reply("<:nao:749403722488217610> Usuário tem um cargo maior que o meu");
   
   let reason = args.slice(1).jnooin(' ');
   
    member.kick(reason)
     .catch(error => message.reply(`<:nao:749403722488217610> Não foi possível ${message.author} Erro: : ${error}`));
   message.reply(`${member.user.tag} foi banido por ${message.author.tag} `);

     
   }
};

module.exports.help = {
   command: 'kick'
};