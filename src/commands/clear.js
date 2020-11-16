const Discord = require("discord.js");
const config = require('../config.json')

exports.run = async (client, message, args) => {
  message.delete().catch(O_o => {});
  if (!message.member.permissions.has("MANAGE_MESSAGES"))
    return message.reply(
      "<:WindowsShield:777579023249178625> | Você não tem permissão para usar este comando. Você precisa da permissão `Gerenciar mensagens` para isso."
    );
  const deleteCount = parseInt(args[0], 10);
  if (!deleteCount || deleteCount < 1 || deleteCount > 99)
    return message.reply(
      "<:Alerta:718944960933527632> forneça um número de até **99 mensagens** a serem excluídas (Você não pode apagar mensagens com mais de 14 dias!)"
    );

  const fetched = await message.channel.messages.fetch({
    limit: deleteCount + 1
  });
  message.channel.bulkDelete(fetched);
  message.channel
    .send(`**${args[0]} mensagens limpas nesse chat!**`).then(msg => msg.delete({timeout: 5000}))
    .catch(error =>
      message.channel.send(`Não foi possível deletar mensagens devido a: ${error}`)
    );
}