module.exports = {
name: "mute",
aliases: ['mute', 'silenciar', 'mutar'],
cooldown: 3,
guildOnly: true,
async execute(client, message, args) {        
    const Discord = require('discord.js')
    
    if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Você não a permissão `Expulsar usuários` para realizar esta ação");
    if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
      message.channel.send("Eu preciso da permissão `Gerenciar cargos` para fazer isso!")
  
  }
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!user) message.channel.send("Este usuário não foi encontrado");
        if(user.id === message.author.id) return message.channel.send("Você não pode mutar a si mesmo!");

        let mutedRole = message.guild.roles.cache.find((r) => r.name === 'Foxy Muted🔇');
        if (!mutedRole) {
            await message.guild.roles.create({
              data: {
                name: 'Foxy Muted🔇',
                permissions: []
              }
           
            });
        }
      

        const role = await message.guild.roles.cache.find(x => x.name === "Foxy Muted🔇"); 
        message.guild.channels.cache.forEach(async (channel, id) => {
            await channel.updateOverwrite(role, {
              'SEND_MESSAGES': false,
              'EMBED_LINKS': false,
              'ATTACH_FILES': false,
              'ADD_REACTIONS': false,
              'SPEAK': false
            });
        
          mutedRole = role;
        })
    
     
     
        let reason = args.slice(1).join(" ");
        if(!reason) reason = "Não especificado"

        user.roles.add(role);
        const mutedembed = new Discord.MessageEmbed()
       .setColor('RED')
       .setTitle('Alguém foi silenciado!')
       .addFields(
           { name: "User:", value: `${user}`},
           { name: "Motivo:", value: `${reason}`}
       )
        message.channel.send(mutedembed) 
    }

    }