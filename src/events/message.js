const user = require('../structures/DatabaseConnection')
const Discord = require('discord.js')
const cooldowns = new Discord.Collection()

module.exports = async (client, message) => {
  if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) message.channel.send(`Olá ${message.author}! Eu sou a ${client.user.username}! Meu prefixo é ${client.config.prefix}, use ${client.config.prefix}help para obter ajuda ${client.emotes.success}`);

  if (!message.content.startsWith(client.config.prefix) || message.author.bot || message.webhookID) return;
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName)
    || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return message.reply(`${client.emotes.notfound} **|** Desculpe a inconveniência mas este comando não existe!`)

  function foxyCommandHandler() {
    if (command.guildOnly && message.channel.type === 'dm') {
      return message.reply(`<:Error:718944903886930013> | ${message.author} Esse comando não pode ser executado em mensagens diretas!`);
    }

    if (command.ownerOnly && !client.config.owners.includes(message.author.id)) {
      return message.reply(`<:Error:718944903886930013> | ${message.author} Você não tem permissão para fazer isso! <:meow_thumbsup:768292477555572736>`);
    }

    if (command.argsRequired && !args.length) {
      return message.reply(`<:Error:718944903886930013> | ${message.author} Esse comando precisa de argumentos para ser executado!`);
    }

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(`:fire: **|** ${message.author}, Por favor aguarde **${timeLeft.toFixed(0)} segundos** para usar o comando novamente`);
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    function runCommands() {
      message.channel.startTyping()
      command.run(client, message, args)
      message.channel.stopTyping()
    }

    runCommands()
  }
  try {
    user.findOne({ userid: message.author.id }, (error, data) => {
      if (error) return foxySelfReport(error, message);
      if (data) {
        if (data.userBanned) {
          const bannedEmbed = new Discord.MessageEmbed()
            .setTitle('<:DiscordBan:790934280481931286> Você foi banido(a) <:DiscordBan:790934280481931286>')
            .setColor(client.colors.error)
            .setDescription('Você foi banido(a) de usar a Foxy em qualquer servidor no Discord! \n Caso seu ban foi injusto (o que eu acho muito difícil) você pode solicitar seu unban no meu [servidor de suporte](https://gg/kFZzmpD) \n **Leia os termos em** [Termos de uso](https://foxywebsite.ml/tos.html)')
            .setFooter('You\'ve been banned from using Foxy on other servers on Discord!');
          return message.author.send(bannedEmbed).catch(() => {
            message.reply(message.author, bannedEmbed);
          });
        }
        return foxyCommandHandler();
      }
      new user({
        userid: message.author.id,
        username: message.author.username,
        userBanned: false,
        premium: false,
      }).save().catch((err) => {
        console.log('[MONGO ERROR] - ' + err)
      });
      return foxyCommandHandler();
    });
  } catch (error) {
    console.log('[HANDLER ERROR] - ' + error, message);
  }
};
