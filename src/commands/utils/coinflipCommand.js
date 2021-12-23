module.exports = {
  name: 'coinflip',
  aliases: ['coinflip', 'caracoroa'],
  cooldown: 3,
  guildOnly: false,
  clientPerms: ['READ_MESSAGE_HISTORY'],

  async run(client, message, args) {
    const array1 = ['cara', 'coroa'];

    const rand = Math.floor(Math.random() * array1.length);

    if (!args[0] || (args[0].toLowerCase() !== 'cara' && args[0].toLowerCase() !== 'coroa')) {
      message.reply('insira **cara** ou **coroa** na frente do comando.');
    } else if (args[0].toLowerCase() == array1[rand]) {
      message.reply(`Deu **${array1[rand]}**, você ganhou dessa vez!`);
    } else if (args[0].toLowerCase() != array1[rand]) {
      message.reply(`Deu **${array1[rand]}**, você perdeu dessa vez!`);
    }
  },

};
