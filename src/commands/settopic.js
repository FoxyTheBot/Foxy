exports.run = async (client, message, args) => {
    if(message.channel.type === 'dm') return
    if (!message.member.permissions.has("MANAGE_CHANNELS"))
    return message.reply(
      "<:WindowsShield:777579023249178625> | Você não tem permissão para executar este comando! Você precisará da permissão `Gerenciar Canais`"
    );
    if (!message.guild.me.permissions.has("MANAGE_CHANNELS")) return message.reply("Não tenho permissão para executar o comando :/")
    const topic = args.join(' ');
    message.channel.setTopic(topic)
    await message.channel.send(`Tópico alterado para "**${topic}**"`)
}
