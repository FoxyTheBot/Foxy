const Discord = require('discord.js');

module.exports = {
name: "commands",
aliases: ['commands', 'comandos'],
cooldown: 3,
guildOnly: false,
async execute(client, message, args) {
let commands = new Discord.MessageEmbed()
.setColor('RED')
.setDescription('<:laugh:793588288765952030> **| COMANDOS DE DIVERSÃO** \n `tf`, `avatar`, `say`, `attack`, `fate`, `clyde`, `step`, `lick`, `8ball`, `cancel`, `coinflip`, `laranjomemes`, `ppt`, `moonwalk`, `putin`, `ratewaifu`, `sadcats`, `ship`, `friend` \n\n <:DiscordBoost:723225840548184195> **| Role-Play** \n `kiss`, `bite`, `pat`, `run`, `scream`, `laugh`, `hug`, `dance`, `attack`, `sad`, `applause`, `shy`, `smile`, `stare` \n\n <:info:718944993741373511> **| Informações** \n `ideia`, `date`, `termos`, `status`, `help`, `commands`, `uptime`, `covid`, `botinfo`, `servers`, `userinfo`, `partner` \n\n <:defesa:749403739676475462> **| Moderação** \n `ad`, `slowmode`, `clear`, `ban`, `addrole`, `kick`, `settopic`, `mute`, `dm`, `ticket` \n\n <:bug_hunter:789668194494709761> **| Apoio** \n `report`, `donate`, `invite`, `github`, `dbl` \n\n <:DiscordStaff:731947814246154240> **| Utilitários** \n `calc`, `translate`, `id`, `ping`, `ascii`, `morse`, `weather`, `emoji` \n\n <a:a_bongocat:768500700551315487> **| Modificação de imagem** \n `comunismo`, `esponja`, `laranjo`')
await message.channel.send(commands)
}

}