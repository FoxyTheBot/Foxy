const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'atm',
  aliases: ['money', 'atm'],
  cooldown: 5,
  guildOnly: false,

  async run(client, message, args) {
    const db = require('quick.db');
    const user = message.mentions.members.first() || message.author;

    let bal = db.fetch(`coins_${user.id}`);
    if (bal === null) bal = 0;

        if (user == message.author) return message.reply(`💵 **|** ${user} você possui ${bal} FoxCoins`);
        message.reply(`💵 **|** ${message.author}, ${user} possui ${bal} FoxCoins`);
  },
};
