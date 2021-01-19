const Discord = require('discord.js')
module.exports = {
name: "slowmode",
aliases: ['slowmode', 'modolento', 'lento'],
cooldown: 3,
guildOnly: true,
async execute(client, message, args) {
  if (!message.member.permissions.has("MANAGE_CHANNELS"))
    return message.reply(
      "<:WindowsShield:777579023249178625> | Você não tem permissão para executar este comando! Você precisará da permissão `Gerenciar Mensagens` para usar este comando!"
    );
    if(!args[0]) return message.channel.send("Especifique o tempo em segundos (de 1 até 21600 Segundos)")
    let duration = args[0]
    if(args[0] > 21600) return message.channel.send('Utilize apenas de 1 até 21600 segundos ')
    if(isNaN(args[0])) return message.channel.send('Utilize apenas números')
    message.channel.setRateLimitPerUser(duration)
    .catch(() => {
      message.channel.send("Falha ao definir o modo lento neste canal, verifique o comprimento do modo lento.")
    })
    message.channel.send(":turtle: Eu defini o modo lento para " + duration + " segundos!")
}
}