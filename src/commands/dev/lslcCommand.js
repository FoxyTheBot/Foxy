module.exports = {
  name: 'lslc',
  aliases: ['lslc'],
  cooldown: 1,
  guildOnly: true,
  ownerOnly: true,
  async run(client, message, args) {
    const db = require('quick.db');
    const { MessageEmbed, Message } = require('discord.js');
    const user = message.mentions.members.first() || client.users.cache.get(args[1]) || message.author;

    switch (args[0]) {
      case 'remove_coins':

        if (isNaN(args[1])) return;
        db.subtract(`coins_${user.id}`, args[1]);
        const now = await db.fetch(`coins_${user.id}`);
        message.channel.send(`Removido ${args[1]} FoxCoins de ${user} agora ele(a) possui ${now} FoxCoins`);
        break;

      case 'add_coins':
        db.add(`coins_${user.id}`, args[1]);
        const bal = await db.fetch(`coins_${user.id}`);
        message.channel.send(`Foram adicionados ${args[1]} FoxCoins na conta de ${user} agora ele(a) possui ${bal} FoxCoins`);
        break;

      case 'reset_all':
        db.set(`background_${user.id}`, 'default_background.png');
        db.delete(`coins_${user.id}`);
        db.delete(`coins_${user.id}`);
        message.channel.send('Profile data deleted successfully!');
        break;

      case 'reset_background':
        db.set(`background_${user.id}`, 'default_background.png');
        message.channel.send(`O Background de ${user} foi redefinido!`);
        break;

      case 'set_background':
        db.set(`background_${user.id}`, `${args[1]}`);
        message.channel.send(`O arquivo ${args[1]} foi setado no perfil de ${user}`);
        break;

        case 'inspect_user':
        let bank = db.fetch(`bal_${user.id}`)
        let bucks = db.fetch(`coins_${user.id}`)
        let background = db.fetch(`background_${user.id}`)
        let aboutme = db.fetch(`aboutme_${user.id}`)
        const inspect = new MessageEmbed()
        .setColor('RED')
        .setTitle('User Data')
        .setDescription(`${user}'s data`)
        .addFields(
          { name: "FoxBank", value: `${bank}`},
          { name: "Wallet", value: `${bucks} FoxCoins`},
          { name: "Background", value: background},
          { name: "About Me", value: aboutme}
        )
        message.channel.send(message.author, inspect)
          break;
        default:
        const embed = new MessageEmbed()
          .setTitle('Database Settings')
          .setDescription('Altere o valor do banco de dados')
          .addFields(
            { name: 'remove_coins', value: 'Remove as coins de algum usuário' },
            { name: 'add_coins', value: 'Adiciona coins a mais para um usuário' },
            { name: 'reset_all', value: 'Reseta todas as configurações do usuário' },
            { name: 'reset_background', value: 'Reseta o background de algum usuário para o padrão' },
            { name: 'set_background', value: 'Define o background de algum usuário' },
            { name: "inspect_user", value: "Verifica os dados do usuário"}
          );
        message.channel.send(embed);
    }
  },
};
