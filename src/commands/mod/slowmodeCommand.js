module.exports = {
  name: 'slowmode',
  aliases: ['slowmode', 'modolento', 'lento'],
  cooldown: 3,
  guildOnly: true,
  clientPerms: ['MANAGE_CHANNELS', 'READ_MESSAGE_HISTORY'],

  async run(client, message, args) {
    if (!message.member.permissions.has('MANAGE_CHANNELS')) {
      return message.foxyReply(
        '<:WindowsShield:777579023249178625> | Você não tem permissão para executar este comando! Você precisará da permissão `Gerenciar Mensagens` para usar este comando!',
      );
    }
    if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) {
      message.foxyReply('Eu preciso da permissão `Gerenciar canais` para fazer isso!');
    }
    if (!args[0]) return message.foxyReply('Especifique o tempo em segundos (de 1 até 21600 Segundos)');
    const duration = args[0];
    if (args[0] > 21600) return message.foxyReply('Utilize apenas de 1 até 21600 segundos ');
    if (isNaN(args[0])) return message.foxyReply('Utilize apenas números');
    message.channel.setRateLimitPerUser(duration)
      .catch(() => {
        message.foxyReply('Falha ao definir o modo lento neste canal, verifique o comprimento do modo lento.');
      });
    message.foxyReply(`:turtle: Eu defini o modo lento para ${duration} segundos!`);
  },
};
