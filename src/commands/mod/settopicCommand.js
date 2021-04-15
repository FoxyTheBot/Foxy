module.exports = {
  name: 'settopic',
  aliases: ['setartopico', 'settopic', 'topic', 'topico'],
  cooldown: 3,
  guildOnly: true,
  async run(client, message, args) {
    if (message.channel.type === 'dm') return;
    if (!message.member.permissions.has('MANAGE_CHANNELS')) {
      return message.inlineReply(
        `<:WindowsShield:777579023249178625> **|** ${message.author} Você não tem permissão para executar este comando! Você precisará da permissão \`Gerenciar Canais\``,
      );
    }
    if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) return message.inlineReply('Não tenho permissão gerenciar canais!');
    const topic = args.join(' ');
    if(message.content.includes("@")) return message.inlineReply('Você não pode mencionar cargos ou usuários!')
    message.channel.setTopic(topic);
    await message.inlineReply(`Tópico alterado para "**${topic}**"`);
  },
};
