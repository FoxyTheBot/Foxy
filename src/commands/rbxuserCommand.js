module.exports = {
    name: "rbxuser",
    aliases: ['rbxuser', 'rbuser', 'robloxuser', 'robloxu', 'rbuser'],
    cooldown: 5,
    guildOnly: true,

    async execute(client, message, args) {
        const discord = require("discord.js")
        const roblox = require("noblox.js")
        const moment = require('moment')

        let username = args[0]
      if(!username) return message.channel.send(`Especifique um usuário!`)
        if (username) {
            roblox.getIdFromUsername(username).then(id => {
              
              // if an identity is found under the username then continue collecting the rest of the data
              // sadly this means you can't search for banned users. f in the chat. maybe try using older apis
              // yes, i just did c# styled bracketing, do not mind me trying to bless your eyes
              
              if (id) 
     
              {
                // next conditio
                roblox.getPlayerInfo(parseInt(id)).then(function(info) 
     
                {
                  // dates.. um. go try get a pear or a grape instead.
                  moment.locale('pt-br')
                  let date = new Date(info.joinDate)
                  let data = moment(date).format('LL');
                 
                  // create new embed and establish some settings for it, tasty.
                  const embed = new discord.MessageEmbed()
                  .setTitle(info.username)
                  .setColor("e2231a")
                  .setThumbnail(`https://www.roblox.com/bust-thumbnail/image?userId=${id}&width=420&height=420&format=png`)
                  
                  .addField("<:robloxlogo:804814541631914035> Username", `\`${info.username}\`` || 'Sem solução', true)
                  .addField(":computer: User ID", id || 'Sem solução', true)
                  .addField(":blue_book: Sobre mim", info.blurb || 'Nada', true)
                  .addField(":star: Status", info.status || 'Nada', true)
                  .addField(":date: Data de conta", `${info.age} Dias` || 'Sem solução', true)
                  .addField(":calendar: Data de registro", `${data}` || 'Sem solução', true)
                  .addField("User Link", `https://roblox.com/users/${id}/profile`, true)
                  .setFooter(`Search Bot`, client.user.avatarURL)
                  message.channel.send(embed)
                })
              }
              
            
            // but what if the player is banned, or doesn't even exist?
            // houston, we have a problem.
            }).catch(function (err) {
             message.channel.send("Ah! Eu não encontrei este usuário, ou talvez ele não exista, desculpe pera inconveniência!") // catching error
           });  
        } else { message.channel.send("Por favor especifique um usuário válido") }
      
    
    }
}