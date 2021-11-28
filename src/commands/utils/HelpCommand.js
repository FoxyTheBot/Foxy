const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Command = require("../../structures/Command");

module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: "help",
            description: "Mostra o menu de ajuda",
            category: "utils",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("help")
                .setDescription("Mostra o menu de ajuda")
        })
    }

    async execute(interaction) {
        const embed = new MessageEmbed()
            .setTitle(`🎮 | Meus comandos (${this.client.commands.size})`)
            .addFields(
                { name: `💵 Economia (${this.getSize("economy")})`, value: this.getCategory("economy"), inline: true },
                { name: `<:DiscordStaff:731947814246154240> Social e Economia (${this.getSize("social")})`, value: this.getCategory("social"), inline: true },
                { name: `<:DiscordBoost:723225840548184195> Ações (${this.getSize("actions")})`, value: this.getCategory("actions"), inline: true },
                { name: `<a:a_bongocat:768500700551315487> Imagens (${this.getSize("image")})`, value: this.getCategory("image"), inline: true },
                // { name: `${this.client.emotes.denied} Moderação (${this.getSize("mod")})`, value: this.getCategory("mod"), inline: true },
                // { name: `⛏ Minecraft (${this.getSize("mine")})`, value: this.getCategory("mine"), inline: true },
                { name: `<:cute_yay:901111399328124928> Entretenimento (${this.getSize("entertainment")})`, value: this.getCategory("entertainment"), inline: true },
                { name: `<:DiscordStaff:731947814246154240> Utilitários (${this.getSize("utils")})`, value: this.getCategory("utils"), inline: true },
            )

            await interaction.reply({ embeds: [embed] });
    }

    getCategory(category) {
        return this.client.commands.filter(c => c.config.category === category).map(c =>  `\`${c.config.name}\``).join(", ");
    }

    getSize(category) {
        return this.client.commands.filter(c => c.config.category === category).size;
    }
}