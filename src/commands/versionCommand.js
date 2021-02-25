const v = require('../../package.json');

module.exports = {
  name: 'version',
  aliases: ['version', 'versao'],
  cooldown: 3,
  guildOnly: false,
  async run(client, message) {
    message.channel.send(`<:Ping:790731201685356555> **|** ${message.author} \n <:DiscordStaff:731947814246154240> **| Version:** ${v.version}`);
  },
};
