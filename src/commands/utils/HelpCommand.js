const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Command = require("../../structures/Command");

module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: "help",
            description: "Mostra o menu de ajuda",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("help")
                .setDescription("Mostra o menu de ajuda")
        })
    }

    async execute(interaction) {
        const helpEmbed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Foxy - Ajuda")
            .setDescription(`Olá ${interaction.user.username}! Eu sou a Foxy, tenho recursos para entreter e envolver seus membros, recursos de moderação para manter seu servidor seguro \n **Tornar seu servidor único e extraordinário nunca foi tão fácil!**`)
            .setThumbnail('https://cdn.discordapp.com/avatars/737044809650274325/64b92e7d5e7fb48e977e1f04ef13369d.png?size=1024')
            .addField('<:DiscordStaff:731947814246154240> Lista de comandos:', 'Digite /commands')
            .addField(`${this.client.emotes.dev} Está com dúvidas? Meu servidor de suporte`, 'https://discord.gg/W6XtYyqKkg')
            .addField('<:info:718944993741373511> Termos de uso', 'https://foxywebsite.ml/privacy')
            .addField('<:ApoiadorDoDiscord:731946134720741377> Meu Website onde você pode me adicionar', 'https://foxywebsite.ml/');

        await interaction.reply({ embeds: [helpEmbed] });
    }
}