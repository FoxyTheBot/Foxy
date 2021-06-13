module.exports = {
  name: 'ping',
  description: 'Ping!',
  aliases: ['ping', 'p'],
  cooldown: 5,
  guildOnly: false,
  clientPerms: ['READ_MESSAGE_HISTORY'],

  async run(client, message, args) {
    message.foxyReply(`:ping_pong: **| Pong!** \n:watch: **| Gateway:** \`${Date.now() - message.createdTimestamp}ms\`\n:zap: **| API Ping:** \`${Math.round(
      client.ws.ping,
    )}ms\` \n<:info:718944993741373511> **| Shard:** \`${client.shard.ids}/${client.shard.count}\``);
  },

};
