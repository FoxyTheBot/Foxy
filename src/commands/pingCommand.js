module.exports = {
	name: 'ping',
  description: 'Ping!',
  aliases: ['ping', 'p'],
  cooldown: 5,
  guildOnly: false,
	execute(client, message, args) {
    message.channel.startTyping();
    message.channel.send(`:ping_pong: **| Pong!** \n:zap: **| API Ping:** **${Math.round(
      client.ws.ping
    )}ms** \n:watch: **| Gateway:** **${Date.now() - message.createdTimestamp}ms** \n<:info:718944993741373511> **| Shard:** **${client.shard.ids}**`)
    message.channel.stopTyping();
  },
  
};
