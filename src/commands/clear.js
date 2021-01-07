const Discord = require("discord.js");


exports.run = async (client, message, args) => {
  
  if (!message.member.permissions.has("MANAGE_MESSAGES"))
    return message.reply(
      ":Error: você é fraco, lhe falta permissão de `Gerenciar Mensagens` para usar esse comando"
    );
  const deleteCount = parseInt(args[0], 10);
  if (!deleteCount || deleteCount <= 0 || deleteCount > 100)
    return message.reply(
      ":Alerta: forneça um número de até **100 mensagens** a serem excluídas (Você não pode apagar mensagens com mais de 14 dias!)"
    );

  const fetched = await message.channel.messages.fetch({
    limit: deleteCount
  });
  message.channel.bulkDelete(fetched);
  message.channel
    .send(`**${args[0]} mensagens limpas nesse chat! Se as mensagens não foram excluidas é porque tem mais de 14 dias**`).then(msg => msg.delete({timeout: 5000}))
    .catch(error =>
      message.channel.send(`Não foi possível deletar mensagens devido a: ${error}`)
    )
}