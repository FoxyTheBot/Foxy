<<<<<<< HEAD
const { MessageEmbed } = require('discord.js');

module.exports = async (client, guild) => {

  const guildDelete = new MessageEmbed()
    .setTitle('<:sad_cat_thumbs_up:768291053765525525> | Fui removida de um servidor :(')
    .setDescription(`<:sad_cat_patata:769246782168629291> Fui removida do servidor **${guild.name}**`)
    .setThumbnail('https://cdn.discordapp.com/attachments/776930851753426945/839516665502629938/tenor.gif')
    .setFooter(`ID do Servidor: ${guild.id}`);
  
  client.guildWebhook.send(guildDelete);
};
=======
module.exports = class GuildDelete {
    constructor(client) {
        this.client = client;
    }

    async run(guild) {
        this.client.WebhookManager.guildDelete(guild);
    }
}
>>>>>>> 83482c1112c64f03e74695a4414bc15d904cfc26
