module.exports = {
  name: 'ping',
  description: 'Ping!',
  aliases: ['ping', 'p'],
  cooldown: 5,
  guildOnly: false,
  clientPerms: ['READ_MESSAGE_HISTORY'],

  async run(client, message) {
    message.reply(`:ping_pong: **| Pong!** \n:watch: **| Gateway:** \`${Date.now() - message.createdTimestamp}ms\`\n:zap: **| API Ping:** \`${Math.round(
      client.ws.ping,
    )}ms\` \n<:info:718944993741373511> **| Shard:** \`${Number(client.shard.ids)+1}/${client.shard.count}\``);
  },

};