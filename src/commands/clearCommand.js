module.exports = {
  name: "clear",
  description: "Clears messages",

  async run (client, message, args) {

    const amount = args.join(" ");

    if(!amount) return message.reply('Por favor, quantas mensagens eu preciso apagar?')

    if(amount > 100) return message.reply(`Você não pode deletar mais de 100 mensagens`)

    if(amount < 1) return message.reply(`Você precisa deletar pelo menos uma nensagem!`)

    await message.channel.messages.fetch({limit: amount}).then(messages => {
      message.channel.bulkDelete(messages
      )});


    message.channel.send('${amount} mensagens foram excluídas')

  }
}

module.exports.help = { 
  name: 'clear',
  aliases: ["cc", "clear", "cl"]
}