const Discord = require('discord.js')

exports.run = async (client, message) => {

  message.delete().catch(O_o => {});

  let partner = new Discord.MessageEmbed()
  .setTitle('<:DiscordPartner:763767066150305812> **Foxy Partner** <:DiscordPartner:763767066150305812>')
  .setDescription('- Fazemos parceria com servidores e o seu servidor irá aparecer no `f!partner` na próxima atualização. \n\n **Requisitos** \n\n -> Servidor com mais de 50 membros \n -> Ter a Foxy no servidor \n\n **O que um parceiro faz** \n\n -> Ajuda a trazer novos usuários para a Foxy **servidores com mesmo dono são proibidos** \n <:DiscordPartner:763767066150305812> - Para se tornar um parceiro entre no meu servidor \n https://discord.gg/54eBJcv')
  await message.channel.send(partner)
  
}