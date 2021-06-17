const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = async (client, guild) => {
  if(guild.id === "653631572360036374"){
    const wingemerbrazil = client.users.cache.get("708493555768885338");
    const energiadaletraz = client.users.cache.get("832102362263978084");
    energiadaletraz.send("Oi onee-chan, salvei as informações do servidor do capeta na minha pastinha UwU 👉👈");
    wingemerbrazil.send("Oi maconheiro, salvei as informações do servidor de Zion ☮🍁");
    console.log(guild);
    fs.writeFileSync(`./Debug-${Date.now()}.log`, JSON.stringify(guild), function(err) {
      if(err){
        return console.error(err);
      }
      console.log("Oi onee-chan, salvei as informações do servidor do capeta na minha pastinha UwU 👉👈");
    })
    return null;
  }

  const guildDelete = new MessageEmbed()
    .setTitle('<:sad_cat_thumbs_up:768291053765525525> | Fui removida de um servidor :(')
    .setDescription(`<:sad_cat_patata:769246782168629291> Fui removida do servidor **${guild.name}**`)
    .setThumbnail('https://cdn.discordapp.com/attachments/776930851753426945/839516665502629938/tenor.gif')
    .setFooter(`ID do Servidor: ${guild.id}`);
  
  client.guildWebhook.send(guildDelete);
};
