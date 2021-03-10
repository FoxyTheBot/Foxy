module.exports = {
  name: 'settopic',
  aliases: ['setartopico', 'settopic', 'topic', 'topico'],
  cooldown: 3,
  guildOnly: true,
  async run(client, message, args) {
    if (message.channel.type === 'dm') return;
    if (!message.member.permissions.has('MANAGE_CHANNELS')) {
      return message.reply(
        `<:WindowsShield:777579023249178625> **|** ${message.author} Você não tem permissão para executar este comando! Você precisará da permissão \`Gerenciar Canais\``,
      );
    }
    if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) return message.reply('Não tenho permissão gerenciar canais!');
    const topic = args.join(' ');
    if (topic == '@everyone') return message.reply('Você não pode usar everyone nos tópicos!');
    if (topic == '@here') return message.reply('Você não pode usar here no tópico!');
    message.channel.setTopic(topic);
    await message.reply(`Tópico alterado para "**${topic}**"`);
  },
};
