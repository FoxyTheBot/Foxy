const user = require('../structures/DatabaseConnection')
const Discord = require('discord.js')
const cooldowns = new Discord.Collection()

module.exports = async (client, message) => {
  if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) message.channel.send(`Olá ${message.author}! Meu nome é ${client.user.username}, meu prefixo é \`${client.config.prefix}\`, Utilize \`${client.config.prefix}help\` para obter ajuda! ${client.emotes.success}`);

  const prefixRegex = new RegExp(`^(${client.config.prefix}|<@!?${client.user.id}>)( )*`, "gi");

  if (!message.content.match(prefixRegex) || message.author.bot || message.webhookID) return;
  const args = message.content.replace(prefixRegex, "").trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  function FoxyHandler() {
    if (command.guildOnly && message.channel.type === 'dm') {
      return message.FoxyReply(`<:Error:718944903886930013> | ${message.author} Esse comando não pode ser executado em mensagens diretas!`);
    }

    if (command.ownerOnly && !client.config.owners.includes(message.author.id)) {
      return message.FoxyReply(`<:Error:718944903886930013> | ${message.author} Você não tem permissão para fazer isso! <:meow_thumbsup:768292477555572736>`);
    }

    if (command.clientPerms && !message.guild.members.cache.get(client.user.id).permissions.has(command.clientPerms)) {

      let clientPermissions = [];

      if (command.clientPerms.includes('MANAGE_CHANNELS')) clientPermissions.push('`Gerenciar Canais`');
      if (command.clientPerms.includes('CREATE_INSTANT_INVITE')) clientPermissions.push('`Criar convite`');
      if (command.clientPerms.includes('CHANGE_NICKNAME')) clientPermissions.push('`Alterar apelido`');
      if (command.clientPerms.includes('VIEW_CHANNEL')) clientPermissions.push('`Ver canais`');
      if (command.clientPerms.includes('SEND_MESSAGES')) clientPermissions.push('`Enviar mensagens`');
      if (command.clientPerms.includes('MANAGE_MESSAGES')) clientPermissions.push('`Gerenciar mensagens`');
      if (command.clientPerms.includes('EMBED_LINKS')) clientPermissions.push('`Inserir links`');
      if (command.clientPerms.includes('ATTACH_FILES')) clientPermissions.push('`Anexar arquivos`');
      if (command.clientPerms.includes('READ_MESSAGE_HISTORY')) clientPermissions.push('`Ver histórico de mensagens`');
      if (command.clientPerms.includes('USE_EXTERNAL_EMOJIS')) clientPermissions.push('`Usar emojis externos`');
      if (command.clientPerms.includes('ADD_REACTIONS')) clientPermissions.push('`Adicionar reações`');
      if (command.clientPerms.includes('CONNECT')) clientPermissions.push('`Conectar`');
      if (command.clientPerms.includes('SPEAK')) clientPermissions.push('`Falar`');

      return message.FoxyReply(`${client.emotes.error} **|** ${message.author} Aparentemente está faltando as permissões ${clientPermissions.join(", ")} para executar esse comando!`)
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
        return message.FoxyReply(`${client.emotes.scared} **|** ${message.author}, Por favor aguarde **${time}** para usar o comando novamente`);
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    async function runCommands() {
      message.channel.startTyping()
      await command.run(client, message, args)
      message.channel.stopTyping()
    }

    runCommands()
  }
  try {
    user.findOne({ userid: message.author.id }, (error, data) => {
      if (error) return console.log(`Algo deu errado! ${error} | ${message}`)
      if (data) {
        if (data.userBanned) {
          const bannedEmbed = new Discord.MessageEmbed()
            .setTitle('<:DiscordBan:790934280481931286> Você foi banido(a) <:DiscordBan:790934280481931286>')
            .setColor(client.colors.error)
            .setDescription('Você foi banido(a) de usar a Foxy em qualquer servidor no Discord! \n Caso seu ban foi injusto (o que eu acho muito difícil) você pode solicitar seu unban no meu [servidor de suporte](https://gg/kFZzmpD) \n **Leia os termos em** [Termos de uso](https://foxywebsite.ml/tos.html)')
            .setFooter('You\'ve been banned from using Foxy on other servers on Discord!');
          return message.author.send(bannedEmbed).catch(() => {
            message.FoxyReply(message.author, bannedEmbed);
          });
        }
        return FoxyHandler();
      }
      new user({
        userid: message.author.id,
        username: message.author.username,
        userBanned: false,
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
