exports.run = async (client, message, args) => {
    if (!message.member.permissions.has("MANAGE_CHANNELS"))
    return message.reply(
      "<:WindowsShield:777579023249178625> | Você não tem permissão para executar este comando! Você precisará da permissão `Gerenciar Canais`"
    );
    const topic = args.join(' ');
    message.channel.setTopic(topic)
    await message.channel.send(`Tópico alterado para "**${topic}**"`)
}