module.exports = {
  name: 'settopic',
  aliases: ['setartopico', 'settopic', 'topic', 'topico'],
  cooldown: 3,
  guildOnly: true,
  clientPerms: ['MANAGE_CHANNELS', 'READ_MESSAGE_HISTORY'],
  
  async run(client, message, args) {
    if (message.channel.type === 'dm') return;
    if (!message.member.permissions.has('MANAGE_CHANNELS')) {
      return message.FoxyReply(
        `<:WindowsShield:777579023249178625> **|** ${message.author} Você não tem permissão para executar este comando! Você precisará da permissão \`Gerenciar Canais\``,
      );
    }
    if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) return message.FoxyReply('Não tenho permissão gerenciar canais!');
    const topic = args.join(' ');
    if(message.content.includes("@")) return message.FoxyReply('Você não pode mencionar cargos ou usuários!')
    message.channel.setTopic(topic);
    await message.FoxyReply(`Tópico alterado para "**${topic}**"`);
  },
};
