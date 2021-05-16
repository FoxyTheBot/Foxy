module.exports = {
  name: 'slowmode',
  aliases: ['slowmode', 'modolento', 'lento'],
  cooldown: 3,
  guildOnly: true,
  clientPerms: ['MANAGE_CHANNELS'],

  async run(client, message, args) {
    if (!message.member.permissions.has('MANAGE_CHANNELS')) {
      return message.FoxyReply(
        '<:WindowsShield:777579023249178625> | Você não tem permissão para executar este comando! Você precisará da permissão `Gerenciar Mensagens` para usar este comando!',
      );
    }
    if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) {
      message.FoxyReply('Eu preciso da permissão `Gerenciar canais` para fazer isso!');
    }
    if (!args[0]) return message.FoxyReply('Especifique o tempo em segundos (de 1 até 21600 Segundos)');
    const duration = args[0];
    if (args[0] > 21600) return message.FoxyReply('Utilize apenas de 1 até 21600 segundos ');
    if (isNaN(args[0])) return message.FoxyReply('Utilize apenas números');
    message.channel.setRateLimitPerUser(duration)
      .catch(() => {
        message.FoxyReply('Falha ao definir o modo lento neste canal, verifique o comprimento do modo lento.');
      });
    message.FoxyReply(`:turtle: Eu defini o modo lento para ${duration} segundos!`);
  },
};
