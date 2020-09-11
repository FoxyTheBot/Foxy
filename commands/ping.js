const Discord = require('discord.js')

module.exports.run = async (client, message, args) => {

    const m = await message.channel.send('<a:discord_clyde:750940164284743712> Calculando Latência.');
  
    m.edit(`<:ping:749403780998758520> **| Pong!**\nLatência do Server: **${m.createdTimestamp -
        message.createdTimestamp}ms.**\nLatência da API: **${Math.round(
      client.ws.ping
    )}ms**`
    );
  };