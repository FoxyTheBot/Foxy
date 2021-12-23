<<<<<<< HEAD
const { MessageEmbed } = require('discord.js')

module.exports = async (client, guild) => {
  const guildCreate = new MessageEmbed()
    .setTitle(`${client.emotes.success} | Fui adicionada em um servidor! :3`)
    .setThumbnail('https://cdn.discordapp.com/attachments/782995363548102676/839517480640577536/yay_fast.gif')
    .setDescription(`<a:cat_explosion:831146965479063553> Fui adicionada no servidor **${guild.name}**`)
    .setFooter(`ID do Servidor: ${guild.id}`)

    client.guildWebhook.send(guildCreate);
=======
module.exports = class GuildCreate {
    constructor(client) {
        this.client = client;
    }

    async run(guild) {
        this.client.WebhookManager.guildCreate(guild);
    }
>>>>>>> 83482c1112c64f03e74695a4414bc15d904cfc26
}