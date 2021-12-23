module.exports = {
  name: 'atm',
  aliases: ['money', 'atm'],
  cooldown: 5,
  guildOnly: false,

  async run(client, message, args) {
    const userMention = message.mentions.users.first() || message.author;
    const userData = await client.db.getDocument(userMention.id);

    await message.reply(`${userMention} tem ${userData.balance} FoxCoins!`);
  }
}
