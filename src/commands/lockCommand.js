const emotes = require('../structures/emotes.json')
module.exports = {
    name: "lock",
    aliases: ['lock', 'trancar', 'bloquear'],
    cooldown: 2,
    guildOnly: true,

    async execute(client, message, args) {
        if(!message.member.permissions.has("MANAGE_CHANNELS"))
       
        return message.reply('Você precisa da permissão `Gerenciar canais` para fazer isso!')
        const role = await message.guild.roles.cache.find(x => x.name === "@everyone"); 
        
            await message.channel.updateOverwrite(role, {
              'SEND_MESSAGES': false,
              'ADD_REACTIONS': false
            });
            message.channel.send(`${emotes.lock} **|** Canal bloqueado com sucesso! Use f!unlock para desbloquear. ${emotes.success}`)

        
        }

    }
