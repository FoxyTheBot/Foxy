const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("botinfo")
        .setDescription("Informações sobre a Foxy <3"),

    execute(client, interaction) {

        let totalSeconds = client.uptime / 1000;
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const uptime = `${days.toFixed()}d ${hours.toFixed()}h ${minutes.toFixed()}m ${seconds.toFixed()}s`;

        const embed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle("Olá, Eu me chamo Foxy!")
            .setDescription(`Olá, eu sou a Foxy, sou um bot de economia para o Discord mas com outras funções com o foco de entreter o seu servidor :>! Estou espalhando alegria e fofura em mais de **${client.guilds.cache.size} Servidores** :heart:! \nFaz **${uptime}** que eu acordei desde 26 de Julho de 2020`)
            .addFields(
                { name: "<:AddMember:797181629826859029> | Me adicione", value: "[Me adicione](https://discord.com/oauth2/authorize?client_id=737044809650274325&scope=bot+applications.commands&permissions=269872255)", inline: true },
                { name: '<:DiscordExplore:790934280611037196> | Servidor de Suporte', value: '[Entre no meu servidor](https://discord.gg/Tj6AMkbXbA)', inline: true },
                { name: ":heart: | Bots que inspiraram a criação da Foxy", value: "[Inspirações](https://foxywebsite.ml/inspiration.html)", inline: true },
                { name: '<:Twitter:797184287816286209> | Meu Twitter', value: '[@FoxyDiscordBot](https://twitter.com/FoxyDiscordBot)', inline: true },
                { name: '<:paypal:776965353904930826> | Doe para mim', value: '[Doe para mim clicando aqui](https://www.paypal.com/donate/?hosted_button_id=J7Y747Q38UEKN)', inline: true },
                { name: '<:GitHub:746399300728258710> | Sabia que eu sou Open Source? ', value: '[GitHub](https://github.com/FoxyTheBot/Foxy)', inline: true },
                { name: "👑 | Algumas menções :>", value: `• **Win#4682** | Se não fosse ele eu nem iria existir \n• **Bis❄#2332** | Minha artista oficial <3 \n\n E você: ${interaction.user} que está falando comigo!` }
            )
            .setFooter('Foxy foi criada por Win#4682', 'https://cdn.discordapp.com/attachments/792745835607752715/832677709288702022/5f1454f18ec74902ffc7c3f75a4d0dea.png');

        interaction.reply({ embeds: [embed] });
    }
}