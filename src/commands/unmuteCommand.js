const { prefix } = require('../../config.json')
module.exports = {
    name: "unmute",
    aliases: ['unmute'],
    guildOnly: true,

    async execute(client, message, args) {
        const member = message.mentions.members.first();
        const mutedRole = message.guild.roles.cache.find((r) => r.name === 'Foxy Muted🔇');
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
            message.channel.send("Eu preciso da permissão `Gerenciar cargos` para fazer isso!")
        
        }

        if (!member) {
            let msg = await message.channel.send(`Use ${prefix}unmute <@usuario>`);
            msg.delete({ timeout: deletionTimeout });
            return message.react(reactionError);
          } 
          member.roles.remove(mutedRole);
          await message.channel.send('Usuário desmutado com sucesso!')
    }
}