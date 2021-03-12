const { MessageEmbed } = require('discord.js');
module.exports = {
  name: 'commands',
  aliases: ['commands', 'comandos'],
  cooldown: 3,
  guildOnly: false,
  async run(client, message, args) {
    switch (args[0]) {
      case 'diversão':
        const fun = new MessageEmbed()
          .setColor(client.colors.default)
          .setTitle('<:laugh:793588288765952030> | Comandos de diversão')
          .setDescription('`tf`, `avatar`, `httpcat`, `say`, `attack`, `ponpon`, `fate`, `clyde`, `step`, `lick`, `8ball`, `cancel`, `coinflip`, `laranjomemes`, `ppt`, `moonwalk`, `putin`, `ratewaifu`, `sadcats`, `ship`, `friend`');
        message.reply(fun);
        break;

      case 'ações':
        const actions = new MessageEmbed()
          .setColor(client.colors.rp)
          .setTitle('<:DiscordBoost:723225840548184195> | Ações ')
          .setDescription('`kiss`, `bite`, `pat`, `run`, `scream`, `laugh`, `hug`, `dance`, `attack`, `sad`, `applause`, `shy`, `smile`, `stare`');
        message.reply(actions);
        break;

      case 'informações':
        const info = new MessageEmbed()
          .setColor(client.colors.default)
          .setTitle('<:info:718944993741373511> | Informações')
          .setDescription('`donate`, `remind`, `invite`, `github`, `dbl`, `ideia`, `date`, `termos`, `status`, `help`, `commands`, `uptime`, `covid`, `botinfo`, `sugerir`, `userinfo`, `serverinfo`');
        message.reply(info);
        break;

      case 'mod':
        const mod = new MessageEmbed()
          .setColor(client.colors.moderation)
          .setTitle('<:WindowsShield:777579023249178625> | Moderação')
          .setDescription('`slowmode`, `lock`, `unlock`, `settopic`');
        message.reply(mod);
        break;

      case 'utils':
        const utils = new MessageEmbed()
          .setColor(client.colors.default)
          .setTitle('<:DiscordStaff:731947814246154240> | Utilitários')
          .setDescription('`calc`, `translate`, `ping`, `ascii`, `morse`, `weather`, `emoji`, `servericon`, `rbuser`');
        message.reply(utils);
        break;

      case 'imagem':
        const image = new MessageEmbed()
          .setColor(client.colors.default)
          .setTitle('<a:a_bongocat:768500700551315487> | Manipulação de imagem')
          .setDescription('`comunismo`, `error`, `esponja`, `laranjo`, `stonks`, `notstonks`');
        message.reply(image);
        break;

      case 'suporte':
        const support = new MessageEmbed()
          .setColor(client.colors.default)
            .setTitle(`${client.emotes.dev} | Suporte`)
          .setDescription('`report`, `sugerir`');
        message.reply(support);
        break;

      case 'mine':
        const mine = new MessageEmbed()
          .setColor(client.colors.mine)
          .setTitle('<:Minecraft:804858374780878868> | Minecraft')
          .setDescription('`mcbody`, `mcskin`, `mchead`, `minerar`');
        message.reply(mine);
        break;

      case 'social':
        const social = new MessageEmbed()
          .setColor(client.colors.rp)
          .setTitle('<:AddMember:797181629826859029> | Social e economia')
          .setDescription('`profile`, `marry`, `divorce`, `pay`, `daily`, `rep`, `background`, `bank`, `deposit`, `remove`, `work`');
        message.reply(social);
        break;
      case 'all':
        const commands = new MessageEmbed()
          .setColor('RED')
          .setDescription('<:laugh:793588288765952030> **| COMANDOS DE DIVERSÃO** \n `tf`, `avatar`, `httpcat`, `say`, `attack`, `ponpon`, `fate`, `clyde`, `step`, `lick`, `8ball`, `cancel`, `coinflip`, `laranjomemes`, `ppt`, `moonwalk`, `putin`, `ratewaifu`, `sadcats`, `ship`, `friend` \n\n <:DiscordBoost:723225840548184195> **| Role-Play** \n `kiss`, `bite`, `pat`, `run`, `scream`, `laugh`, `hug`, `dance`, `attack`, `sad`, `applause`, `shy`, `smile`, `stare` \n\n <:info:718944993741373511> **| Informações** \n `ideia`, `date`, `termos`, `status`, `help`, `commands`, `uptime`, `covid`, `botinfo`, `sugerir`, `servers`, `userinfo`, `serverinfo` \n\n <:defesa:749403739676475462> **| Moderação** \n `slowmode`, `lock`, `unlock`, `settopic` \n\n <:info:718944993741373511> **| Informações** \n `report`, `donate`, `remind`, `invite`, `github`, `dbl` \n\n <:DiscordStaff:731947814246154240> **| Utilitários** \n `calc`, `translate`, `ping`, `ascii`, `morse`, `weather`, `emoji`, `servericon`, `rbuser` \n\n <a:a_bongocat:768500700551315487> **| Modificação de imagem** \n `comunismo`, `error`, `esponja`, `laranjo`, `stonks`, `notstonks` \n\n <:Minecraft:804858374780878868> **| Minecraft** \n `mcbody`, `mcskin`, `mchead`, `minerar` \n\n<:AddMember:797181629826859029> **| Social e Economia** \n `profile`, `pay`, `marry`, `divorce`, `daily`, `rep`, `background`, `bank`, `deposit`, `remove`, `work`');
        await message.reply(commands);
        break;

      default:
        const noargs = new MessageEmbed()
          .setColor(client.colors.default)
          .setTitle(`${client.emotes.success} | Categoria de comandos`)
          .setDescription('Veja os comandos separados por categorias! \n\n **Categorias:** `diversão`, `ações`, `informações`, `mod`, `utils`, `imagem`, `suporte`, `mine`, `social`')
          .setFooter('Use f!commands <categoria> | Para ver a lista de comandos completa use f!commands all');
        message.reply(noargs);
        break;
    }
  },
};
