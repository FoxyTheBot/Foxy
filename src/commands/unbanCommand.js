module.exports = {
    name: "unban",
    aliases: ['unban', 'desbanir'],
    cooldown: 3,
    guildOnly: true,

    async execute(client, message, args) {
        if(!message.member.hasPermission("BAN_MEMBERS")) {
            return message.channel.send(`**${message.author.username}**, Você não tem permissão para fazer isto!`)
          }
          
          if(!message.guild.me.hasPermission("BAN_MEMBERS")) {
            return message.channel.send(`**${message.author.username}**, Eu não tenho permissão para dar ban nem unban nos usuários`)
          }
          
          let userID = args[0]
            message.guild.fetchBans().then(bans=> {
            if(bans.size == 0) return 
            let bUser = bans.find(b => b.user.id == userID)
            if(!bUser) return
            message.guild.members.unban(bUser.user)
            message.channel.send('<:meow_thumbsup:768292477555572736> Usuário desbanido! Espero que leia as regras da próxima vez')
      })
    }
}