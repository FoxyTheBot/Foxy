const { MessageEmbed } = require('discord.js');
module.exports = {
  name: 'commands',
  aliases: ['commands', 'comandos'],
  cooldown: 3,
  guildOnly: false,
  async run(client, message, args) {
        const CommandsEmbed = new MessageEmbed()
          .setTitle('🎮 | Meus comandos')
          .setColor('RED')
          .addFields(
            { name: "<:defesa:749403739676475462> **| Moderação**", value: "`slowmode`, `lock`, `unlock`, `settopic`", inline: true},
            { name: "<a:a_bongocat:768500700551315487> **| Imagem**", value: "`comunismo`, `error`, `esponja`, `laranjo`, `stonks`, `notstonks`", inline: true},
            { name: "<:Minecraft:804858374780878868> **| Minecraft**", value: "`mcbody`, `mcskin`, `mchead`, `minerar`", inline: true},
            { name: "<:AddMember:797181629826859029> **| Social e Economia**", value: "`profile`, `pay`, `marry`, `divorce`, `daily`, `rep`, `background`, `work`, `bet`, `ship`, `ratewaifu`, `fate`", inline: true},
            { name: "<:laugh:793588288765952030> **| Diversão**", value: "`tf`, `avatar`, `httpcat`, `say`, `clyde`, `8ball`, `cancel`, `coinflip`, `laranjomemes`, `ppt`, `putin`, `sadcats`", inline: true},
            { name: "<:DiscordBoost:723225840548184195> **| Role-Play**", value: "`kiss`, `bite`, `pat`, `run`, `attack`, `ponpon`, `scream`, `laugh`, `hug`, `step`, `moonwalk`, `lick`, `dance`, `attack`, `sad`, `applause`, `shy`, `smile`, `stare`", inline: true},
            { name: "<:info:718944993741373511> **| Informações**", value: "`ideia`, `termos`, `status`, `help`, `commands`, `uptime`, `botinfo`, `sugerir`, `userinfo`, `serverinfo`", inline: true},
            { name: "<:DiscordStaff:731947814246154240> **| Utilitários**", value: "`report`, `donate`, `remind`, `invite`, `github`, `dbl`, `calc`, `translate`, `ping`, `ascii`, `morse`, `weather`, `emoji`, `servericon`, `rbuser`", inline: true}
            )
          message.reply(CommandsEmbed);

  },
};
