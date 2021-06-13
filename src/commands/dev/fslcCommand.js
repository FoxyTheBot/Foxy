module.exports = {
  name: 'fslc',
  aliases: ['fslc'],
  cooldown: 1,
  guildOnly: true,
  ownerOnly: true,
  async run(client, message, args) {
    const db = require('quick.db');
    const { MessageEmbed } = require('discord.js');
    const user = message.mentions.members.first() || client.users.cache.get(args[1]) || message.author;

    switch (args[0]) {
      case 'remove_coins':

        if (isNaN(args[1])) return;
        db.subtract(`coins_${user.id}`, args[1]);
        const now = await db.fetch(`coins_${user.id}`);
        message.foxyReply(`Removido ${args[1]} FoxCoins de ${user} agora ele(a) possui ${now} FoxCoins`);
        break;

      case 'add_coins':
        db.add(`coins_${user.id}`, args[1]);
        const bal = await db.fetch(`coins_${user.id}`);
        message.foxyReply(`Foram adicionados ${args[1]} FoxCoins na conta de ${user} agora ele(a) possui ${bal} FoxCoins`);
        break;

      case 'reset_all':
        db.set(`background_${user.id}`, 'default_background.png');
        db.delete(`coins_${user.id}`);
        db.delete(`coins_${user.id}`);
        message.foxyReply('Profile data deleted successfully!');
        break;

      case 'reset_background':
        db.set(`background_${user.id}`, 'default_background.png');
        message.foxyReply(`O Background de ${user} foi redefinido!`);
        break;

      case 'set_background':
        db.set(`background_${user.id}`, `${args[1]}`);
        message.foxyReply(`O arquivo ${args[1]} foi setado no perfil de ${user}`);
        break;

      case 'inspect_user':
        const userdata = await client.users.fetch(args[1])
        const bucks = db.fetch(`coins_${userdata.id}`)
        const background = db.fetch(`background_${userdata.id}`)
        const aboutme = db.fetch(`aboutme_${userdata.id}`)
        const inspect = new MessageEmbed()
          .setColor('RED')
          .setTitle('User Data')
          .setDescription(`${userdata.username}'s data`)
          .addFields(
            { name: "Wallet", value: `${bucks} FoxCoins` },
            { name: "Background", value: background },
            { name: "About Me", value: aboutme }
          )
        message.foxyReply(message.author, inspect).catch(err => {
          console.clear()
          message.foxyReply(err)
        })
        break;

      case 'find_user':
        const data2 = new MessageEmbed()
          .setColor(client.colors.default)
          .setTitle('User Info')
          .setDescription(`${usedata.tag}`)
        message.foxyReply(data2).catch(err => {
          console.clear()
          message.foxyReply(err)
        })
        break;

      default:
        const embed = new MessageEmbed()
          .setDescription('**Comandos:**')
          .addFields(
            { name: 'remove_coins', value: 'Remove as coins de algum usuário' },
            { name: 'add_coins', value: 'Adiciona coins a mais para um usuário' },
            { name: 'reset_all', value: 'Reseta todas as configurações do usuário' },
            { name: 'reset_background', value: 'Reseta o background de algum usuário para o padrão' },
            { name: 'set_background', value: 'Define o background de algum usuário' },
            { name: "inspect_user", value: "Verifica os dados do usuário" }
          );
        message.foxyReply(embed);
    }
  },
};
