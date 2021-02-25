const { prefix } = require('../../config.json');

module.exports = {
  name: 'unmute',
  aliases: ['unmute'],
  guildOnly: true,

  async run(client, message) {
    const member = message.mentions.members.first();
    const mutedRole = message.guild.roles.cache.find((r) => r.name === 'Foxy Muted🔇');
    if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
      message.channel.send('Eu preciso da permissão `Gerenciar cargos` para fazer isso!');
    }

    if (!member) {
      const msg = await message.channel.send(`Use ${prefix}unmute <@usuario>`);
      return message.react('❌');
    }
    member.roles.remove(mutedRole);
    await message.channel.send('Usuário desmutado com sucesso!');
  },
};
