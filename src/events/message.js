const user = require('../structures/databaseConnection')
const Discord = require('discord.js')
const cooldowns = new Discord.Collection()
const { permissionsLocale } = require("../json/permissionsLocale.json");

module.exports = async (client, message) => {

  if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) message.channel.send(`Olá ${message.author}! Meu nome é ${client.user.username}, meu prefixo é \`${client.config.prefix}\`, Utilize \`${client.config.prefix}help\` para obter ajuda! ${client.emotes.success}`);

  const prefixRegex = new RegExp(`^(${client.config.prefix}|<@!?${client.user.id}>)( )*`, "gi");

  if (!message.content.match(prefixRegex) || message.author.bot || message.webhookID) return;
  const args = message.content.replace(prefixRegex, "").trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;


  function FoxyHandler() {

    if (command.onlyDevs && !client.config.owners.includes(message.author.id)) {
      return message.foxyReply(`<:Error:718944903886930013> | ${message.author} Você não tem permissão para fazer isso! <:meow_thumbsup:768292477555572736>`);
    }

    const guildMember = Object(message.guild.members.cache.get(client.user.id));

    if (command.clientPerms && !message.guild.members.cache.get(client.user.id).permissions.has(command.clientPerms)) {
      let missingPermissions = [];
      for (const permission of command.clientPerms) {
        if (!guildMember.permissions.has(permission)) {
          const permissionName = permissionsLocale.find((index) => index.id == permission);
          missingPermissions.push(permissionName);
        }
      }

      return message.channel.send(`${client.emotes.error} **|** ${message.author} Aparentemente está faltando as permissões ${missingPermissions.join(", ")} para executar esse comando!`)
    };

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
        let time = `${timeLeft.toFixed(0)} segundos`
        if (time <= 0) time = "Alguns milisegundos"
        return message.foxyReply(`${client.emotes.scared} **|** ${message.author}, Por favor aguarde **${time}** para usar o comando novamente`);
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    command.run(client, message, args)
  }

  try {
    user.findOne({ userid: message.author.id }, (error, data) => {
      if (error) return console.log(`Algo deu errado! ${error} | ${message}`)
      if (data) return FoxyHandler();

      new user({
        user: message.author.id,
        coins: 0,
        lastDaily: null,
        reps: 0,
        lastRep: null,
        backgrounds: ['default.png'],
        background: 'default.png',
        aboutme: null,
        marry: null,
        premium: false,
      }).save().catch((err) => {
        console.log('[MONGO ERROR] - ' + err)
      });
      return FoxyHandler();
    });
  } catch (error) {
    console.log('[HANDLER ERROR] - ' + error, message);
  }
};