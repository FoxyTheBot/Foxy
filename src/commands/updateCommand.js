module.exports = {
  name: 'update',
  aliases: ['update', 'dblu'],
  guildOnly: false,
  ownerOnly: true,

  async run(client, message) {
    const DBL = require('dblapi.js');
    const { dbltoken } = require('../../config.json');
    const dbl = new DBL(dbltoken, client);
    dbl.postStats(client.guilds.cache.size, client.shard.ids, client.shard.count);
    dbl.on('error', (err) => console.error('\x1b[37m\x1b[41mERROR\x1b[0m: Ocorreu um erro ao se conectar com a Discord Bot List API', err));
    await message.channel.send('Discord Bot List updated!');
  },

};
