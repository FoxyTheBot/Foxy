const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Mostra uma lista de comandos'),

    execute(client, interaction) {
        const commandList = new MessageEmbed()
            .setColor("BLURPLE")
            .setTitle("Lista de comandos")
            .addFields(
                { name: `${client.emotes.denied} **| Moderação**`, value: "`slowmode`, `lock`, `unlock`, `settopic`", inline: true },
                { name: "<a:a_bongocat:768500700551315487> **| Imagem**", value: "`comunismo`, `error`, `esponja`, `laranjo`, `stonks`, `notstonks`, `girlfriend`, `perfect`", inline: true },
                { name: "<:Minecraft:804858374780878868> **| Minecraft**", value: "`mcbody`, `mcskin`, `mchead`, `minerar`", inline: true },
                { name: "<:AddMember:797181629826859029> **| Social e Economia**", value: "`profile`, `setbackground`, `pay`, `marry`, `divorce`, `daily`, `rep`, `background`, `bet`, `ship`, `ratewaifu`, `fate`", inline: true },
                { name: "<:laugh:793588288765952030> **| Diversão**", value: "`tf`, `avatar`, `httpcat`, `say`, `8ball`, `cancel`, `coinflip`, `ppt`, `putin`, `sadcats`", inline: true },
                { name: "<:DiscordBoost:723225840548184195> **| Role-Play**", value: "`kiss`, `bite`, `pat`, `run`, `attack`, `ponpon`, `scream`, `laugh`, `hug`, `step`, `moonwalk`, `lick`, `dance`, `attack`, `sad`, `applause`, `shy`, `smile`, `stare`", inline: true },
                { name: "<:info:718944993741373511> **| Informações**", value: "`ideia`, `status`, `help`, `commands`, `uptime`, `botinfo`, `sugerir`, `userinfo`, `serverinfo`", inline: true },
                { name: "<:DiscordStaff:731947814246154240> **| Utilitários**", value: "`report`, `donate`, `remind`, `invite`, `dbl`, `calc`, `translate`, `ping`, `ascii`, `morse`, `weather`, `servericon`, `rbuser`", inline: true }
            )
            .setFooter('Alguns comandos não aparecerão porque são privados')

        interaction.reply({ embeds: [commandList] });
    }
}