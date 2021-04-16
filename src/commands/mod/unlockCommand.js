module.exports = {
  name: 'unlock',
  aliases: ['unlock'],
  cooldown: 2,
  guildOnly: true,

  async run(client, message) {
    if (!message.member.permissions.has('MANAGE_CHANNELS')) { return message.FoxyReply('Você precisa da permissão `Gerenciar canais` para fazer isso!'); }
    const role = await message.guild.roles.cache.find((x) => x.name === '@everyone');
    await message.channel.updateOverwrite(role, {
      SEND_MESSAGES: true,
      EMBED_LINKS: true,
      ATTACH_FILES: true,
      ADD_REACTIONS: true,
    });
    message.FoxyReply(':unlock: **|** Canal desbloqueado com sucesso! Use f!lock para bloquear.');
  },
};
