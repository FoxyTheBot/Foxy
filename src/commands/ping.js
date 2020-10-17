const Discord = require('discord.js')

module.exports.run = async (client, message, args) => {

  message.delete().catch(O_o => {});  
  
  const m = await message.channel.send('<a:discord_clyde:750940164284743712> Calculando Latência.');
  
    m.edit(`<:ping:749403780998758520> **| Pong!**\n <:host:754144285338763407> Latência do Server: **${m.createdTimestamp -
        message.createdTimestamp}ms.**\n<a:ping2:754144264161591336> Latência da API: **${Math.round(
      client.ws.ping
    )}ms**`
    );
  };