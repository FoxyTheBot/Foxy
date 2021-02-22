const emotes = require('../structures/emotes.json')
module.exports = {
    name: "unlock",
    aliases: ['unlock'],
    cooldown: 2,
    guildOnly: true,

    async execute(client, message, args) {
        if(!message.member.permissions.has("MANAGE_CHANNELS"))
       
        return message.reply('Você precisa da permissão `Gerenciar canais` para fazer isso!')
        const role = await message.guild.roles.cache.find(x => x.name === "@everyone"); 
            await message.channel.updateOverwrite(role, {
              'SEND_MESSAGES': true,
              'EMBED_LINKS': true,
              'ATTACH_FILES': true,
              'ADD_REACTIONS': true
            });
            message.channel.send(`${emotes.unlock} **|** Canal desbloqueado com sucesso! Use f!lock para bloquear. ${emotes.success}`)

        }
        } 

    
