module.exports = {
  name: 'settopic',
  aliases: ['setartopico', 'settopic', 'topic', 'topico'],
  cooldown: 3,
  guildOnly: true,
  clientPerms: ['MANAGE_CHANNELS', 'READ_MESSAGE_HISTORY'],
  
  async run(client, message, args) {
    if (message.channel.type === 'dm') return;

    if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) return message.reply('Não tenho permissão gerenciar canais!');
    const topic = args.join(' ');
    if(message.content.includes("@")) return message.reply('Você não pode mencionar cargos ou usuários!')
    message.channel.setTopic(topic);
    await message.reply(`Tópico alterado para "**${topic}**"`);
  },
};
