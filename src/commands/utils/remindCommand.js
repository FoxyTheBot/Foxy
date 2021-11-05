module.exports = {
  name: 'remind',
  aliases: ['remind', 'lembrar', 'lembrete'],
  guildOnly: true,
  cooldown: 5,
  clientPerms: ['READ_MESSAGE_HISTORY'],

  async run(client, message, args) {
    const Discord = require('discord.js');
    const db = require('quick.db');
    const ms = require('ms');
    const reason = args.slice(1).join(' ');

    const timeuser = args[0];
    const example = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('Como usar :thinking:')
      .addFields(
        { name: ':bell: Exemplo:', value: '`f!remind 10s Atualizar o Windows`' },
      );
    if (message.content.includes("@")) return message.reply("Você não pode mencionar usuários ou cargos!")
    if (isNaN(timeuser)) {
      message.reply(`${client.emotes.error} **|** Por favor, digite um número válido!`)

    } else if (!timeuser) {
      return message.reply(example)
    }

    if (!reason) return message.reply(':no_bell: Você precisa digitar o lembrete');

    db.set(`remind_${message.author.id}`, Date.now() + ms(timeuser));

    message.reply(`:bell: **|** Ok! Eu irei te lembrar de \`${reason}\` em \`${timeuser}\``);
    const interval = setInterval(() => {
      if (Date.now() > db.fetch(`remind_${message.author.id}`)) {
        db.delete(`remind_${message.author.id}`);
        message.reply(`:bell: **|** Hey ${message.author}! Lembrete: \`${reason}\``)
          .catch((e) => console.log(e));
        clearInterval(interval);
      }
    }, 1000);
  },
};
