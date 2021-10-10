const user = require('../../structures/databaseConnection');
module.exports = {
  name: 'atm',
  aliases: ['money', 'atm'],
  cooldown: 5,
  guildOnly: false,

  async run(client, message, args) {
    const userMention = message.mentions.users.first() || message.author;
    const userData = await user.findOne({ user: userMention.id });

    if (!userData) {
      message.foxyReply("Parece que você não está no meu banco de dados, execute o comando novamente!");
      return new user({
        user: userMention.id,
        coins: 0,
        lastDaily: null,
        reps: 0,
        lastRep: null,
        backgrounds: ['default.png'],
        background: 'default.png',
        aboutme: null,
        marry: null,
        premium: false,
      }).save().catch(err => console.log(err));
    }
    await message.foxyReply(`${userMention} tem ${userData.coins} FoxCoins!`);
  }
}
