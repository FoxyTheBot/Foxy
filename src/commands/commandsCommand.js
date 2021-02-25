const { MessageEmbed } = require('discord.js');
const colors = require('../structures/color.json');
const emotes = require('../structures/emotes.json');

module.exports = {
  name: 'commands',
  aliases: ['commands', 'comandos'],
  cooldown: 3,
  guildOnly: false,
  async run(client, message, args) {
    switch (args[0]) {
      case 'diversão':
        const fun = new MessageEmbed()
          .setColor(colors.default)
          .setTitle('<:laugh:793588288765952030> | Comandos de diversão')
          .setDescription('`tf`, `avatar`, `httpcat`, `say`, `attack`, `ponpon`, `fate`, `clyde`, `step`, `lick`, `8ball`, `cancel`, `coinflip`, `laranjomemes`, `ppt`, `moonwalk`, `putin`, `ratewaifu`, `sadcats`, `ship`, `friend`');
        message.channel.send(fun);
        break;

      case 'ações':
        const actions = new MessageEmbed()
          .setColor(colors.rp)
          .setTitle('<:DiscordBoost:723225840548184195> | Ações ')
          .setDescription('`kiss`, `bite`, `pat`, `run`, `scream`, `laugh`, `hug`, `dance`, `attack`, `sad`, `applause`, `shy`, `smile`, `stare`');
        message.channel.send(actions);
        break;

      case 'informações':
        const info = new MessageEmbed()
          .setColor(colors.default)
          .setTitle('<:info:718944993741373511> | Informações')
          .setDescription('`donate`, `remind`, `invite`, `github`, `dbl` ,`ideia`, `date`, `termos`, `status`, `help`, `commands`, `uptime`, `covid`, `botinfo`, `sugerir`, `servers`, `userinfo`, `serverinfo`');
        message.channel.send(info);
        break;

      case 'mod':
        const mod = new MessageEmbed()
          .setColor(colors.moderation)
          .setTitle('<:WindowsShield:777579023249178625> | Moderação')
          .setDescription('`slowmode`, `clear`, `ban`, `addrole`, `kick`, `lock`, `unlock`, `mute`, `unmute`, `settopic`, `ticket`, `unban`');
        message.channel.send(mod);
        break;

      case 'utils':
        const utils = new MessageEmbed()
          .setColor(colors.default)
          .setTitle('<:DiscordStaff:731947814246154240> | Utilitários')
          .setDescription('`calc`, `translate`, `id`, `ping`, `ascii`, `morse`, `weather`, `emoji`, `servericon`, `rbuser`');
        message.channel.send(utils);
        break;

      case 'imagem':
        const image = new MessageEmbed()
          .setColor(colors.default)
          .setTitle('<a:a_bongocat:768500700551315487> | Manipulação de imagem')
          .setDescription('`comunismo`, `error`, `esponja`, `laranjo`');
        message.channel.send(image);
        break;

      case 'suporte':
        const support = new MessageEmbed()
          .setColor(colors.default)
          .setTitle(`${emotes.dev} | Suporte`)
          .setDescription('`report`, `sugerir`');
        message.channel.send(support);
        break;

      case 'mine':
        const mine = new MessageEmbed()
          .setColor(colors.mine)
          .setTitle('<:Minecraft:804858374780878868> | Minecraft')
          .setDescription('`mcbody`, `mcskin`, `mchead`');
        message.channel.send(mine);
        break;

      case 'social':
        const social = new MessageEmbed()
          .setColor(colors.rp)
          .setTitle('<:AddMember:797181629826859029> | Social e economia')
          .setDescription('`profile`, `pay`, `daily`, `roleta`, `rep`, `background`, `bank`, `deposit`, `remove`, `rob`');
        message.channel.send(social);
        break;
      case 'all':
        const commands = new MessageEmbed()
          .setColor('RED')
          .setDescription('<:laugh:793588288765952030> **| COMANDOS DE DIVERSÃO** \n `tf`, `avatar`, `httpcat`, `say`, `attack`, `ponpon`, `fate`, `clyde`, `step`, `lick`, `8ball`, `cancel`, `coinflip`, `laranjomemes`, `ppt`, `moonwalk`, `putin`, `ratewaifu`, `sadcats`, `ship`, `friend` \n\n <:DiscordBoost:723225840548184195> **| Role-Play** \n `kiss`, `bite`, `pat`, `run`, `scream`, `laugh`, `hug`, `dance`, `attack`, `sad`, `applause`, `shy`, `smile`, `stare` \n\n <:info:718944993741373511> **| Informações** \n `ideia`, `date`, `termos`, `status`, `help`, `commands`, `uptime`, `covid`, `botinfo`, `sugerir`, `servers`, `userinfo`, `serverinfo` \n\n <:defesa:749403739676475462> **| Moderação** \n `slowmode`, `clear`, `ban`, `addrole`, `kick`, `lock`, `unlock`, `mute`, `unmute`, `settopic`, `ticket`, `unban` \n\n <:info:718944993741373511> **| Informações** \n `report`, `donate`, `remind`, `invite`, `github`, `dbl` \n\n <:DiscordStaff:731947814246154240> **| Utilitários** \n `calc`, `translate`, `id`, `ping`, `ascii`, `morse`, `weather`, `emoji`, `servericon`, `rbuser` \n\n <a:a_bongocat:768500700551315487> **| Modificação de imagem** \n `comunismo`, `error`, `esponja`, `laranjo` \n\n <:Minecraft:804858374780878868> **| Minecraft** \n `mcbody`, `mcskin`, `mchead` \n\n<:AddMember:797181629826859029> **| Social e Economia** \n `profile`, `pay`, `daily`, `roleta`, `rep`, `background`, `bank`, `deposit`, `remove`, `rob`');
        await message.channel.send(commands);
        break;

      default:
        const noargs = new MessageEmbed()
          .setColor(colors.default)
          .setTitle(`${emotes.success} | Categoria de comandos`)
          .setDescription('Veja os comandos separados por categorias! \n\n **Categorias:** `diversão`, `ações`, `informações`, `mod`, `utils`, `imagem`, `suporte`, `mine`, `social`')
          .setFooter('Use f!commands <categoria> | Para ver a lista de comandos completa use f!commands all');
        message.channel.send(noargs);
        break;
    }
  },
};
